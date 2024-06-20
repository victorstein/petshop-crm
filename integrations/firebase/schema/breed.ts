import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import type { FirestoreDocumentReference } from 'shared/firebase-utils'
import { getRepository } from '../orm/get-repository'

export class Breed {
  id: FirestoreDocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  characteristics?: string[]
}

export const breedRepository = getRepository(Breed)
