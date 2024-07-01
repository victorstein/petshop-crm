import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { getRepository } from '../orm/get-repository'
import type { DocumentReference } from 'firebase/firestore'

export class Breed {
  id: DocumentReference

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
