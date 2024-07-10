import { faker } from '@faker-js/faker'
import {
  type SocialMediaProvider,
  SupportedAuthProviders
} from 'integrations/firebase/schema/social-media-provider'

export const createDummySocialMedia = (
  socialMediaData?: Partial<SocialMediaProvider>
): Omit<SocialMediaProvider, 'id'> => {
  const socialMedia: Omit<SocialMediaProvider, 'id'> = {
    provider: faker.helpers.arrayElement(Object.values(SupportedAuthProviders)),
    metadata: {
      accessToken: faker.string.alphanumeric(20),
      refreshToken: faker.string.alphanumeric(20),
      expiresIn: faker.number.int({ min: 1, max: 1000 }),
      tokenType: 'Bearer'
    },
    ...socialMediaData
  }

  console.log('Social media created successfully 📱')

  return socialMedia
}
