import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested
} from 'class-validator'
import { Media } from './media'
import { SocialMediaProvider } from './social-media-provider'
import { SubCollection } from '../orm/decorators/sub-collection'
import { Type } from 'class-transformer'
import { getRepository } from '../orm/get-repository'
import type { DocumentReference } from 'firebase/firestore'

export enum SupportedRoles {
  ADMIN = 'admin',
  USER = 'user',
  SHELTER = 'shelter'
}

export class User {
  id: DocumentReference

  @SubCollection()
  @Type(() => Media)
  @ValidateNested()
  profilePicture: Media

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsEnum(SupportedRoles)
  role: SupportedRoles = SupportedRoles.USER

  @SubCollection()
  @Type(() => SocialMediaProvider)
  @ValidateNested()
  socialMediaProvider: SocialMediaProvider
}

export const userRepository = getRepository(User)
