import { type Address } from 'integrations/firebase/schema/address'
import { faker } from '@faker-js/faker'

export const createDummyAddress = (
  addressData?: Partial<Address>
): Omit<Address, 'id'> => {
  const address: Omit<Address, 'id'> = {
    addressLine1: faker.location.streetAddress(),
    addressLine2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    ...addressData
  }

  console.log('Address created successfully 📍')

  return address
}
