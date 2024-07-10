import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import type { DocumentReference } from 'firebase/firestore'

export class Address {
  id: DocumentReference

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
