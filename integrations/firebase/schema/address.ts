import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import type { FirestoreDocumentReference } from 'shared/firebase-utils'

export class Address {
  id: FirestoreDocumentReference

  @IsString()
  @IsNotEmpty()
  addressLine1: string

  @IsString()
  @IsOptional()
  addressLine2?: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  state: string

  @IsString()
  @IsOptional()
  zipCode: string
}
