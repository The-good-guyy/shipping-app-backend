import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Role } from '../../role/entities/role.entity';
export const roleFactory = setSeederFactory(Role, (faker: Faker) => {
  const role = new Role();
  role.role = faker.internet.domainWord();
  return role;
});
