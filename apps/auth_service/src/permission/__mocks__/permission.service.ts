import { permissionStub } from '../test/stubs/permission.stub';
export const permissionService = jest.fn().mockReturnValue(() => ({
  create: jest.fn().mockReturnValue(permissionStub()),
  remove: jest.fn(),
  update: jest.fn().mockReturnValue(permissionStub()),
  findByCode: jest.fn().mockReturnValue(permissionStub()),
  findByName: jest.fn().mockReturnValue(permissionStub()),
}));
