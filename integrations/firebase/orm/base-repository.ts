import * as FireStore from 'firebase/firestore'
import { db } from '..'
import { type Constructor, type RecursiveOmit } from './types'
import { ValidateSchema } from './decorators/validate-schema'

export abstract class BaseRepository<T> {
  abstract readonly model: Constructor<T>
  private readonly firestore: typeof FireStore
  private readonly database: FireStore.Firestore

  constructor(database?: FireStore.Firestore, fireStore?: typeof FireStore) {
    this.firestore = fireStore ?? FireStore
    this.database = database ?? db
  }

  @ValidateSchema()
  async create(data: RecursiveOmit<T, 'id'>): Promise<T> {
    const subCollectionMeta: Record<keyof T, unknown> = Reflect.getMetadata(
      'subCollections',
      this.model.prototype as Record<keyof T, unknown>
    )

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

    // Separate subcollection data from main collection data
    const { main: mainCollectionData, sub: subCollectionData } = Object.entries(
      data as Record<keyof T, unknown>
    ).reduce(
      (acc, [key, value]) => {
        if (key in subCollectionMeta) {
          return { ...acc, sub: { ...acc.sub, [key]: value } }
        }

        return { ...acc, main: { ...acc.main, [key]: value } }
      },
      {
        main: {},
        sub: {}
      }
    )

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
}
