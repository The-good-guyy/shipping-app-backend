import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../users/entities/user.entity';
import { hash } from 'bcrypt';
export const userFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
    user.email = faker.internet.email();
    user.username = faker.internet.userName();
    user.password = await hash("12345", 10);
    user.profileImage = faker.image.avatar();
  return user;
}