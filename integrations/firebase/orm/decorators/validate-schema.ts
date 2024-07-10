import { plainToClass } from 'class-transformer'
import type { Constructor } from '../types'
import { validateSync } from 'class-validator'
import {
  isDocumentReference,
  isGeoPoint,
  isObject,
  isTimestamp
} from 'shared/firebase-utils'

export function ValidateSchema(): (
  _: any,
  __: string,
  descriptor: PropertyDescriptor
) => PropertyDescriptor {
  function transformFirestoreTypes(
    obj: Record<string, unknown>
  ): Record<string, unknown> {
    Object.keys(obj).forEach((key) => {
      const val = obj[key]
      if (obj[key] === undefined) return
      if (isTimestamp(val)) {
        obj[key] = val.toDate()
      } else if (isGeoPoint(val)) {
        const { latitude, longitude } = val
        obj[key] = { latitude, longitude }
      } else if (isDocumentReference(val)) {
        const { id, path } = val
        obj[key] = { id, path }
      } else if (isObject(val)) {
        transformFirestoreTypes(val)
      }
    })
    return obj
  }

  async function validateArgs(
    input: Record<string, unknown>,
    model: Constructor<unknown>
  ): Promise<void> {
    try {
      const parsedInput = transformFirestoreTypes(input)
      const objectInstance = plainToClass(model, parsedInput)

      const errors = validateSync(objectInstance as object, {
        skipMissingProperties: false,
        stopAtFirstError: false
      })

      if (errors.length > 0) {
        const parsedErrors = errors.flatMap((error) =>
          Object.values(error.constraints ?? {})
        )
        throw new Error(parsedErrors.toString().replace(/,/g, '\n'))
      }
    } catch (error) {
      throw new Error(String(error))
    }
  }

  return function (
    _: Constructor<unknown>,
    __: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: unknown[]) {
      const [input] = args
      // crate a copy of the input for validation
      const inputCopy = { ...(input as Record<string, unknown>) }

      // @ts-expect-error - We know that model is a constructor
      const model = this.model as Constructor<unknown>
      await validateArgs(inputCopy, model)
      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}
