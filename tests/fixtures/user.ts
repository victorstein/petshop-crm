import { faker } from '@faker-js/faker'
import type { RecursiveOmit } from 'integrations/firebase/orm/types'
import {
  SupportedRoles,
  type User,
  userRepository
} from 'integrations/firebase/schema/user'
import { createDummyMedia } from './media'
import { createDummySocialMedia } from './social-media'

export const createDummyUser = async (
  userData?: Partial<User>
): Promise<User> => {
  const [profilePicture] = Array.from({ length: 1 }, () => createDummyMedia())
  const socialMediaProvider = createDummySocialMedia()

  const dummyUser: RecursiveOmit<User, 'id'> = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    profilePicture,
    role: faker.helpers.arrayElement(Object.values(SupportedRoles)),
    socialMediaProvider,
    ...userData
  }

  const user = await userRepository.create(dummyUser)

  console.log('User created successfully 🙋‍♂️')

  return user
}
