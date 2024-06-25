import 'reflect-metadata'
import 'dotenv/config'
import { createDummyBreed } from 'tests/fixtures/breed'
import { createDummyShelter } from 'tests/fixtures/shelter'
import { createDummyShelteredAnimal } from 'tests/fixtures/sheltered-animal'
import { createDummyUser } from 'tests/fixtures/user'
import { shelteredAnimalRepository } from '../schema/sheltered-animal'

const seedDb = async (): Promise<void> => {
  const shelter = await createDummyShelter()
  const breed = await createDummyBreed()
  const shelteredAnimal = await createDummyShelteredAnimal(shelter.id, breed.id)
  await createDummyUser()

  const foundShelteredAnimal = await shelteredAnimalRepository.findById(
    shelteredAnimal.id.id,
    { pupulate: true }
  )
  console.log('Sheltered Animal found:', foundShelteredAnimal)

  console.log('Database seeded successfully 🌱')
  process.exit(0)
}

seedDb().catch((error) => {
  console.error(error)
  process.exit(1)
})
