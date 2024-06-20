import { faker } from '@faker-js/faker'
import {
  type Media,
  SupportedMimeTypes
} from 'integrations/firebase/schema/media'

export const createDummyMedia = (
  mediaData?: Partial<Media>
): Omit<Media, 'id'> => {
  const media: Omit<Media, 'id'> = {
    name: faker.system.fileName(),
    mimeType: faker.helpers.arrayElement(Object.values(SupportedMimeTypes)),
    url: faker.image.url(),
    ...mediaData
  }

  console.log('Media created successfully 🏞️')

  return media
}
