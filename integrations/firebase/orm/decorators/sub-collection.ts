import type { Constructor } from '../types'

export interface SubCollectionMetadata {
  key: string
  type: 'Array' | string
}

export const SubCollection = <T>(name?: string) => {
  return function (targetClass: T, propertyKey: string) {
    const target = targetClass as Constructor<T>
    const key = name ?? propertyKey
    const type = Reflect.getMetadata('design:type', target, propertyKey).name

    const subCollections = Reflect.getMetadata('subCollections', target) ?? []
    Reflect.defineMetadata(
      'subCollections',
      { ...subCollections, [propertyKey]: { key, type } },
      target
    )
  }
}
