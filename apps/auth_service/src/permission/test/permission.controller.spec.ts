import { Test } from '@nestjs/testing';
import { PermissionController } from '../permission.controller';
import { PermissionService } from '../permission.service';
import { Permission } from '../entities/permission.entity';
import { permissionStub } from './stubs/permission.stub';
describe('PermissionController', () => {
  let permissionController: PermissionController;
  let permissionService: PermissionService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [PermissionService],
    }).compile();
    permissionController =
      moduleRef.get<PermissionController>(PermissionController);
    permissionService = moduleRef.get<PermissionService>(PermissionService);
    jest.clearAllMocks();
  });
  describe('getPermissionById', () => {
    describe('when getPermissionById is called', () => {
      let permission: Permission;
      //   jest
      //     .spyOn(permissionService, 'findById')
      //     .mockResolvedValue(permissionStub() as Permission);
      beforeEach(async () => {
        permission = await permissionController.findOneById(
          permissionStub().id,
        );
      });
      test('then it should call permissionService.getPermissionById', () => {
        expect(permissionService.findById).toHaveBeenCalledWith(
          permissionStub().id,
        );
      });
      test('then it should return a permission', () => {
        expect(permission).toEqual(permissionStub());
      });
    });
  });
  describe('createPermission', () => {
    describe('when createPermission is called', () => {
      let permission: Permission;
      const createPermissionDto = {
        permission: permissionStub().permission,
        action: permissionStub().action,
        object: permissionStub().object,
        possession: permissionStub().possession,
      };
      //   jest
      //     .spyOn(permissionService, 'create')
      //     .mockResolvedValue(permissionStub() as Permission);
      beforeEach(async () => {
        permission =
          await permissionController.createPermission(createPermissionDto);
      });
      test('then it should call permissionService.createPermission', () => {
        expect(permissionService.create).toHaveBeenCalledWith(
          createPermissionDto,
        );
      });
      test('then it should return a permission', () => {
        expect(permission).toEqual(permissionStub());
      });
    });
  });
  describe('updatePermission', () => {
    describe('when updatePermission is called', () => {
      let permission: Permission;
      //   jest
      //     .spyOn(permissionService, 'update')
      //     .mockResolvedValue(permissionStub() as Permission);
      const updatePermissionDto = {
        id: permissionStub().id,
        permission: permissionStub().permission,
        action: permissionStub().action,
        object: permissionStub().object,
        possession: permissionStub().possession,
      };
      beforeEach(async () => {
        permission = await permissionController.update(updatePermissionDto);
      });
      test('then it should call permissionService.updatePermission', () => {
        expect(permissionService.update).toHaveBeenCalledWith(
          updatePermissionDto,
        );
      });
      test('then it should return a permission', () => {
        expect(permission).toEqual(permissionStub());
      });
    });
  });
  describe('removePermission', () => {
    describe('when removePermission is called', () => {
      beforeEach(async () => {
        await permissionController.remove(permissionStub().id);
      });
      test('then it should call permissionService.removePermission', () => {
        expect(permissionService.remove).toHaveBeenCalledWith(
          permissionStub().id,
        );
      });
      test('then it should run 1', () => {
        expect(permissionService.remove).toHaveBeenCalledTimes(1);
      });
    });
  });
});
