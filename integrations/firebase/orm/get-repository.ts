import { BaseRepository } from './base-repository'
import type { Constructor } from './types'

export const getRepository = <T>(entity: Constructor<T>): BaseRepository<T> => {
  class Repository extends BaseRepository<T> {
    readonly model = entity
  }

  return new Repository()
}
