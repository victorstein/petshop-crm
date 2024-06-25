import * as FireStore from 'firebase/firestore'
import { db } from '..'
import { type Constructor, type RecursiveOmit } from './types'
import { ValidateSchema } from './decorators/validate-schema'

export abstract class BaseRepository<T> {
  abstract readonly model: Constructor<T>
  readonly firestore: typeof FireStore
  readonly database: FireStore.Firestore

  constructor(database?: FireStore.Firestore, fireStore?: typeof FireStore) {
    this.firestore = fireStore ?? FireStore
    this.database = database ?? db
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
  ): Promise<T | null> {
    // allows digesting Document references
    if (id instanceof FireStore.DocumentReference) {
      id = id.id
    }

    const doc = await this.firestore.getDoc(
      this.firestore.doc(this.database, this.model.name, id)
    )

    if (!doc.exists()) {
      return null
    }

    const subCollections = this.getSubCollections()

    if (!options.pupulate || subCollections === undefined) {
      return { id, ...doc.data() } as T
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
          id: subCollection.id,
          ...subCollection.data()
        }))
      })
    )

    const subCollectionsDataMap = subCollectionsKeys.reduce(
      (acc, key, index) => ({
        ...acc,
        [key]: subCollectionsData[index]
      }),
      {}
    )

    return { id, ...doc.data(), ...subCollectionsDataMap } as T
  }
}
