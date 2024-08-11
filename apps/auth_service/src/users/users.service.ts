import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { createUserDto, updateUserDto } from './dto';
import { getChangedFields } from '../common/helpers';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(input: createUserDto) {
    const newUser = await this.userRepository.create(input);
    return newUser;
  }
  async remove(userId: string): Promise<void> {
    await this.userRepository.findByCode(userId);
    await this.userRepository.remove(userId);
  }
  async update(input: updateUserDto) {
    const existingEntity = await this.userRepository.findByCode(input.uuid);

    const updatedData = getChangedFields<updateUserDto>(existingEntity, input);
    return await this.userRepository.update(input.uuid, updatedData);
  }
  async findById(userId: string) {
    const user = await this.userRepository.findByCode(userId);
    return user;
  }
  async findByIdWithSensitiveInfo(userId: string) {
    const fields = this.userRepository.getColsUser();
    const user = await this.userRepository.findByCode(userId, fields);
    return user;
  }
}
