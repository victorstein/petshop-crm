import { IsEnum } from 'class-validator'
import type { FirestoreDocumentReference } from 'shared/firebase-utils'

export enum SupportedAuthProviders {
  FACEBOOK = 'facebook.com',
  GITHUB = 'github.com',
  GOOGLE = 'google.com',
  PASSWORD = 'password',
  PHONE = 'phone',
  TWITTER = 'twitter.com',
  ANONYMOUS = 'anonymous'
}

export class SocialMediaProvider {
  id: FirestoreDocumentReference

  @IsEnum(SupportedAuthProviders)
  provider: SupportedAuthProviders

  metadata?: Record<string, any>
}
