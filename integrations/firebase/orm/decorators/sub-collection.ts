import type { Constructor } from '../types'

export const SubCollection = <T>(name?: string) => {
  return function (targetClass: T, propertyKey: string) {
    const target = targetClass as Constructor<T>
    const key = name ?? propertyKey

    const subCollections = Reflect.getMetadata('subCollections', target) ?? []
    Reflect.defineMetadata(
      'subCollections',
      { ...subCollections, [propertyKey]: { key } },
      target
    )
  }
}
