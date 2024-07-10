import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator'
import type { DocumentReference } from 'firebase/firestore'

export enum SupportedMimeTypes {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp'
}

export class Media {
  id: DocumentReference

  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(SupportedMimeTypes)
  mimeType: SupportedMimeTypes

  @IsUrl()
  url: string
}
