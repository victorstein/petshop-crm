import { faker } from '@faker-js/faker'
import {
  type Shelter,
  shelterRepository,
  SupportedShelterTypes
} from 'integrations/firebase/schema/shelter'
import { createDummyAddress } from './address'
import { createDummyMedia } from './media'
import type { RecursiveOmit } from 'integrations/firebase/orm/types'
import type { FirestoreDocumentReference } from 'shared/firebase-utils'

export const createDummyShelter = async (
  shelterData?: Partial<Shelter>
): Promise<
  RecursiveOmit<Shelter, 'id'> & { id: FirestoreDocumentReference }
> => {
  // Create dummy media
  const [logo, ...shelterMedia] = Array.from({ length: 4 }, () =>
    createDummyMedia()
  )

  const dummyShelter = {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    type: faker.helpers.arrayElement(Object.values(SupportedShelterTypes)),
    website: faker.internet.url(),
    registrationDate: faker.date.recent().toISOString(),
    address: createDummyAddress(),
    logo,
    shelterMedia,
    ...shelterData
  }

  const shelter = await shelterRepository.create(dummyShelter)

  console.log('Shelter created successfully 🏚️')

  return shelter
}
