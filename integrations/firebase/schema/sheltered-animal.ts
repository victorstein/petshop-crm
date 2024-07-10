import {
  IsDateString,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested
} from 'class-validator'
import { Media } from './media'
import { SubCollection } from '../orm/decorators/sub-collection'
import { Type } from 'class-transformer'
import { getRepository } from '../orm/get-repository'
import { DocumentReference } from 'firebase/firestore'

export enum SupportedEnergyLevels {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum SupportedSex {
  MALE = 'male',
  FEMALE = 'female'
}

export enum SupportedTemperaments {
  DOCILE = 'docile',
  AGGRESSIVE = 'aggressive',
  FRIENDLY = 'friendly',
  SHY = 'shy',
  DOMINANT = 'dominant',
  ENERGETIC = 'energetic',
  LAID_BACK = 'laid-back',
  INDEPENDENT = 'independent',
  PROTECTIVE = 'protective',
  PLAYFUL = 'playful',
  CURIOUS = 'curious',
  AFFECTIONATE = 'affectionate',
  NERVOUS = 'nervous',
  SUBMISSIVE = 'submissive'
}

export enum SupportedIntakeTypes {
  STRAY = 'stray',
  SURRENDER = 'surrender',
  TRANSFER = 'transfer',
  BORN_IN_SHELTER = 'born-in-shelter',
  EMERGENCY = 'emergency',
  RECLAIMED = 'reclaimed'
}

export class ShelteredAnimal {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @SubCollection('ProfilePictures')
  @Type(() => Media)
  @ValidateNested()
  profilePicture: Media

  @SubCollection('GalleryImages')
  @Type(() => Media)
  @ValidateNested({ each: true })
  gallery: Media[]

  @IsString()
  @IsNotEmpty()
  description: string

  @IsDateString()
  @IsISO8601()
  registrationDate: string

  @IsString()
  @IsNotEmpty()
  health: string

  @IsNumber()
  @IsPositive()
  ageInYears: number

  @IsEnum(SupportedEnergyLevels)
  energyLevel: SupportedEnergyLevels

  @IsEnum(SupportedTemperaments)
  temperament: SupportedTemperaments

  @IsEnum(SupportedSex)
  sex: SupportedSex

  @IsEnum(SupportedIntakeTypes)
  intakeType: SupportedIntakeTypes

  @IsNotEmpty()
  breed: DocumentReference

  @IsNotEmpty()
  shelter: DocumentReference
}

export const shelteredAnimalRepository = getRepository(ShelteredAnimal)
