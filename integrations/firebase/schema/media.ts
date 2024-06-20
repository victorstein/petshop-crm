import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator'
import type { FirestoreDocumentReference } from 'shared/firebase-utils'

export enum SupportedMimeTypes {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp'
}

export class Media {
  id: FirestoreDocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(SupportedMimeTypes)
  mimeType: SupportedMimeTypes

  @IsUrl()
  url: string
}
