import { Role } from '../role/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);
    const userRepository = dataSource.getRepository(User);
    const user_role = await roleRepository.findOne({ where: { role: 'user' } });
    const userFactory = factoryManager.get(User);
    let users = await userFactory.saveMany(10);
    users = users.map((user) => {
      user.role = user_role;
      return user;
    });
    // User password is hashed in user seed factory
    // User password is "12345"
    await userRepository.save(users);
  }
}
