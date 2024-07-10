import { faker } from '@faker-js/faker'
import type { RecursiveOmit } from 'integrations/firebase/orm/types'
import { type Breed, breedRepository } from 'integrations/firebase/schema/breed'

export const createDummyBreed = async (
  breedData?: Partial<Breed>
): Promise<Breed> => {
  const dummyBreed: RecursiveOmit<Breed, 'id'> = {
    name: faker.animal.dog(),
    description: faker.lorem.sentence(),
    characteristics: Array.from({ length: 3 }, () => faker.lorem.word()),
    ...breedData
  }

  const breed = await breedRepository.create(dummyBreed)

  console.log('Breed created successfully 🧬')

  return breed
}
