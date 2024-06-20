import 'reflect-metadata'
import { createDummyBreed } from 'tests/fixtures/breed'
import { createDummyShelter } from 'tests/fixtures/shelter'
import { createDummyShelteredAnimal } from 'tests/fixtures/sheltered-animal'
import { createDummyUser } from 'tests/fixtures/user'

const seedDb = async (): Promise<void> => {
  const shelter = await createDummyShelter()
  const breed = await createDummyBreed()
  await createDummyShelteredAnimal(shelter.id, breed.id)
  await createDummyUser()

  console.log('Database seeded successfully 🌱')
  process.exit(0)
}

seedDb().catch((error) => {
  console.error(error)
  process.exit(1)
})
