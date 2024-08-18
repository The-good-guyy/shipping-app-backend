import { Permission } from '../permission/entities/permission.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { permissionData } from '../datasources/sampleData/permission.data';

export class permissionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const permissionRepository = dataSource.getRepository(Permission);
    await permissionRepository.save(permissionData);
  }
}
