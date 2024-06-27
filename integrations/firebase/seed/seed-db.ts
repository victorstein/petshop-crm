import 'reflect-metadata'
import 'dotenv/config'
import { createDummyBreed } from 'tests/fixtures/breed'
import { createDummyShelter } from 'tests/fixtures/shelter'
import { createDummyShelteredAnimal } from 'tests/fixtures/sheltered-animal'
import { createDummyUser } from 'tests/fixtures/user'
import { shelteredAnimalRepository } from '../schema/sheltered-animal'
import { breedRepository } from '../schema/breed'

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

  const foundBreed = await breedRepository.findById(
    foundShelteredAnimal.breed.id
  )

  const query = shelteredAnimalRepository.query(
    shelteredAnimalRepository.where('breed', '==', foundBreed.id)
  )

  const shelteredAnimals = await shelteredAnimalRepository.find(query)

  await shelteredAnimalRepository.delete(foundShelteredAnimal.id, {
    cascade: true
  })

  console.log('Sheltered Animals found:', shelteredAnimals)

  console.log('Database seeded successfully 🌱')
  process.exit(0)
}

seedDb().catch((error) => {
  console.error(error)
  process.exit(1)
})
