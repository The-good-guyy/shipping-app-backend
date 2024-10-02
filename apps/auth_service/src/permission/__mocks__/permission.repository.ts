import { permissionStub } from '../test/stubs/permission.stub';
export const PermissionRepository = jest.fn().mockReturnValue(() => ({
  create: jest.fn().mockReturnValue(permissionStub()),
  remove: jest.fn(),
  update: jest.fn().mockReturnValue({}).mockReturnValue(permissionStub()),
  findByCode: jest.fn().mockReturnValue({}).mockReturnValue(permissionStub()),
  findByName: jest.fn().mockReturnValue({}).mockReturnValue(permissionStub()),
}));
