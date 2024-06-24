import { IsEnum } from 'class-validator'
import type { DocumentReference } from 'firebase/firestore'

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
  id: DocumentReference

  @IsEnum(SupportedAuthProviders)
  provider: SupportedAuthProviders

  metadata?: Record<string, any>
}
