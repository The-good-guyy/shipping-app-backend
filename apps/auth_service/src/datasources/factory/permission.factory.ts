import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Permission } from '../../permission/entities/permission.entity';
import { PermissionAction, PermissionObject } from '../../common/constants';
export const permissionFactory = setSeederFactory(
  Permission,
  (faker: Faker) => {
    const permission = new Permission();
    permission.permission = faker.internet.domainWord();
    permission.action = faker.helpers.enumValue(PermissionAction);
    permission.object = faker.helpers.enumValue(PermissionObject);
    permission.createdAt = new Date();
    permission.updatedAt = new Date();
    return permission;
  },
);
