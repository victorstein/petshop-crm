import { faker } from '@faker-js/faker'
import {
  type ShelteredAnimal,
  SupportedEnergyLevels,
  SupportedIntakeTypes,
  SupportedSex,
  SupportedTemperaments,
  shelteredAnimalRepository
} from 'integrations/firebase/schema/sheltered-animal'
import { createDummyMedia } from './media'
import type { RecursiveOmit } from 'integrations/firebase/orm/types'
import type { DocumentReference } from 'firebase/firestore'

export const createDummyShelteredAnimal = async (
  shelterRef: DocumentReference,
  breedRef: DocumentReference,
  shelteredAnimalData?: Partial<ShelteredAnimal>
): Promise<ShelteredAnimal> => {
  const [profilePicture, ...gallery] = Array.from({ length: 4 }, () =>
    createDummyMedia()
  )

  const dummyShelteredAnimal: RecursiveOmit<ShelteredAnimal, 'id'> = {
    name: faker.person.firstName(),
    ageInYears: faker.number.int({ min: 1, max: 20 }),
    energyLevel: faker.helpers.arrayElement(
      Object.values(SupportedEnergyLevels)
    ),
    intakeType: faker.helpers.arrayElement(Object.values(SupportedIntakeTypes)),
    gallery,
    profilePicture,
    description: faker.lorem.paragraph(),
    health: faker.lorem.sentence(),
    registrationDate: faker.date.recent().toISOString(),
    sex: faker.helpers.arrayElement(Object.values(SupportedSex)),
    temperament: faker.helpers.arrayElement(
      Object.values(SupportedTemperaments)
    ),
    breed: breedRef,
    shelter: shelterRef,
    ...shelteredAnimalData
  }

  const shelteredAnimal =
    await shelteredAnimalRepository.create(dummyShelteredAnimal)

  console.log('Sheltered animal created successfully 🐶')

  return shelteredAnimal
}
