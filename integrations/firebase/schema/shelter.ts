import {
  IsDateString,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import { Media } from './media'
import { Address } from './address'
import { SubCollection } from '../orm/decorators/sub-collection'
import { Type } from 'class-transformer'
import { getRepository } from '../orm/get-repository'
import type { FirestoreDocumentReference } from 'shared/firebase-utils'

export enum SupportedShelterTypes {
  MUNICIPAL = 'municipal',
  PRIVATE = 'private',
  SANCTUARY = 'sanctuary',
  NO_KILL = 'no-kill',
  OTHER = 'other'
}

export class Shelter {
  id: FirestoreDocumentReference

  @SubCollection()
  @Type(() => Address)
  @ValidateNested()
  address: Address

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  description?: string

  @IsEnum(SupportedShelterTypes)
  type: SupportedShelterTypes

  @IsOptional()
  website?: string

  @IsISO8601()
  @IsDateString()
  registrationDate: string

  @SubCollection('logos')
  @Type(() => Media)
  @ValidateNested()
  logo: Media

  @SubCollection('shelterMedia')
  @Type(() => Media)
  @ValidateNested({ each: true })
  shelterMedia: Media[]
}

export const shelterRepository = getRepository(Shelter)
