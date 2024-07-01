import * as FireStore from 'firebase/firestore'
import { db } from '..'
import { type Constructor, type RecursiveOmit } from './types'
import { ValidateSchema } from './decorators/validate-schema'
import { type SubCollectionMetadata } from './decorators/sub-collection'

export abstract class BaseRepository<T> {
  abstract readonly model: Constructor<T>
  readonly firestore: typeof FireStore
  readonly database: FireStore.Firestore
  readonly where = FireStore.where
  readonly orderBy = FireStore.orderBy
  readonly limit = FireStore.limit
  readonly startAfter = FireStore.startAfter
  readonly startAt = FireStore.startAt
  readonly endBefore = FireStore.endBefore
  readonly endAt = FireStore.endAt
  readonly limitToLast = FireStore.limitToLast
  readonly or = FireStore.or

  constructor(database?: FireStore.Firestore, fireStore?: typeof FireStore) {
    this.firestore = fireStore ?? FireStore
    this.database = database ?? db
  }

  query(...queryConstraints: FireStore.QueryConstraint[]): FireStore.Query {
    return this.firestore.query(this.collection, ...queryConstraints)
  }

  get collection(): FireStore.CollectionReference {
    return this.firestore.collection(this.database, this.model.name)
  }

  doc(
    ...pathSegments: string[]
  ): FireStore.DocumentReference<
    FireStore.DocumentData,
    FireStore.DocumentData
  > {
    return this.firestore.doc(this.database, this.model.name, ...pathSegments)
  }

  private getSubCollections(): Record<keyof T, unknown> {
    return Reflect.getMetadata(
      'subCollections',
      this.model.prototype as Record<keyof T, unknown>
    )
  }

  private separateCollectionsAndSubCollections(
    metadata: RecursiveOmit<T, 'id'>,
    subCollections: Record<keyof T, unknown>
  ): {
    main: Record<string, unknown>
    sub: Record<string, unknown>
  } {
    // Separate subcollection data from main collection data
    const parsedMeta = Object.entries(metadata).reduce(
      (acc, [key, value]) => {
        if (key in subCollections) {
          return { ...acc, sub: { ...acc.sub, [key]: value } }
        }

        return { ...acc, main: { ...acc.main, [key]: value } }
      },
      {
        main: {},
        sub: {}
      }
    )

    return parsedMeta
  }

  private getRefFromId(id: string): FireStore.DocumentReference {
    return this.firestore.doc(this.database, this.model.name, id)
  }

  @ValidateSchema()
  async create(data: RecursiveOmit<T, 'id'>): Promise<T> {
    const subCollectionMeta: Record<keyof T, unknown> = this.getSubCollections()

    const mainCollection = this.firestore.collection(
      this.database,
      this.model.name
    )

    // Early return if there are no subcollections
    if (subCollectionMeta === undefined) {
      const docRef = await this.firestore.addDoc(
        mainCollection,
        data as FireStore.DocumentData
      )
      return { id: docRef, ...data } as T
    }

    const { main: mainCollectionData, sub: subCollectionData } =
      this.separateCollectionsAndSubCollections(data, subCollectionMeta)

    // Create main collection reference
    const docRef = await this.firestore.addDoc(
      mainCollection,
      mainCollectionData as FireStore.DocumentData
    )

    // Create subcollections references
    const subCollections = Object.entries(subCollectionData)
    for (const [subCollectionKey, data] of subCollections) {
      if (Array.isArray(data)) {
        const subCollectionRef = this.firestore.collection(
          this.database,
          this.model.name,
          docRef.id,
          subCollectionKey
        )

        for (const item of data) {
          await this.firestore.addDoc(
            subCollectionRef,
            item as FireStore.DocumentData
          )
        }

        continue
      }

      // If not an array just create a single document
      const subCollectionRef = this.firestore.collection(
        this.database,
        this.model.name,
        docRef.id,
        subCollectionKey
      )

      await this.firestore.addDoc(
        subCollectionRef,
        data as FireStore.DocumentData
      )
    }

    return { id: docRef, ...mainCollectionData } as T
  }

  async findById(
    id: string | FireStore.DocumentReference,
    options: { pupulate: boolean } = { pupulate: false }
  ): Promise<T> {
    // allows digesting Document references
    if (id instanceof FireStore.DocumentReference) {
      id = id.id
    }

    const doc = await this.firestore.getDoc(
      this.firestore.doc(this.database, this.model.name, id)
    )

    if (!doc.exists()) {
      throw new Error(`${this.model.name} not found`)
    }

    const subCollections = this.getSubCollections()

    if (options.pupulate === false || subCollections === undefined) {
      return { id: this.getRefFromId(id), ...doc.data() } as T
    }

    const subCollectionsKeys = Object.keys(subCollections)

    const subCollectionsData = await Promise.all(
      subCollectionsKeys.map(async (key) => {
        const subCollection = this.firestore.collection(
          this.database,
          this.model.name,
          doc.id,
          key
        )

        const subCollectionDocs = await this.firestore.getDocs(subCollection)

        return subCollectionDocs.docs.map((subCollection) => ({
          id: this.getRefFromId(subCollection.id),
          ...subCollection.data()
        }))
      })
    )

    const subCollectionsDataMap = subCollectionsKeys.reduce(
      (acc, key, index) => {
        const subCollectionType = subCollections[
          subCollectionsKeys[index] as keyof T
        ] as SubCollectionMetadata

        if (subCollectionType.type === 'Array') {
          return {
            ...acc,
            [key]: subCollectionsData[index]
          }
        }

        return {
          ...acc,
          [key]: subCollectionsData[index][0]
        }
      },
      {}
    )

    return {
      id: this.getRefFromId(id),
      ...doc.data(),
      ...subCollectionsDataMap
    } as T
  }

  async find(
    query: FireStore.Query,
    options: { pupulate: boolean } = { pupulate: false }
  ): Promise<T[]> {
    const docs = await this.firestore.getDocs(query)

    if (docs.empty) {
      return []
    }

    if (options.pupulate === false) {
      return docs.docs.map((doc) => ({
        id: this.getRefFromId(doc.id),
        ...doc.data()
      })) as T[]
    }

    return await Promise.all(
      docs.docs.map(async (doc) => {
        return await this.findById(doc.id, options)
      })
    )
  }

  async delete(
    id: string | FireStore.DocumentReference,
    options: { cascade: boolean } = { cascade: false }
  ): Promise<void> {
    if (id instanceof FireStore.DocumentReference) {
      id = id.id
    }

    const doc = await this.firestore.getDoc(
      this.firestore.doc(this.database, this.model.name, id)
    )

    if (!doc.exists()) {
      throw new Error(`${this.model.name} not found`)
    }

    const subCollections = this.getSubCollections()

    if (options.cascade === false || subCollections === undefined) {
      await this.firestore.deleteDoc(
        this.firestore.doc(this.database, this.model.name, id)
      )
      return
    }

    const subCollectionsKeys = Object.keys(subCollections)

    // delete all subcollections
    await Promise.all(
      subCollectionsKeys.map(async (key) => {
        const subCollection = this.firestore.collection(
          this.database,
          this.model.name,
          doc.id,
          key
        )

        const subCollectionDocs = await this.firestore.getDocs(subCollection)

        await Promise.all(
          subCollectionDocs.docs.map(async (subCollectionDoc) => {
            await this.firestore.deleteDoc(
              this.firestore.doc(
                this.database,
                this.model.name,
                doc.id,
                key,
                subCollectionDoc.id
              )
            )
          })
        )
      })
    )

    // delete main collection
    await this.firestore.deleteDoc(
      this.firestore.doc(this.database, this.model.name, id)
    )
  }

  async update(
    ref: FireStore.DocumentReference<
      FireStore.DocumentData,
      FireStore.DocumentData
    >,
    data: Record<string, unknown>
  ): Promise<T> {
    const path = ref.path.split('/')
    const collection = path.length === 1 ? this.model.name : path[1]

    const doc = await this.firestore.getDoc(ref)

    if (!doc.exists()) {
      throw new Error(`${collection} not found`)
    }

    await this.firestore.updateDoc(ref, data as FireStore.DocumentData)

    return { id: this.getRefFromId(doc.id), ...data } as T
  }
}
