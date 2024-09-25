import { Test } from '@nestjs/testing';
import { PermissionController } from '../permission.controller';
import { PermissionService } from '../permission.service';
import { PermissionRepository } from '../permission.repository';
describe('PermissionController', () => {
    let permissionController: PermissionController;
    let permissionService: PermissionService;
    let permissionRepository: PermissionRepository;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
        controllers: [PermissionController],
        providers: [PermissionService , PermissionRepository],
        }).compile();
    });
    }
