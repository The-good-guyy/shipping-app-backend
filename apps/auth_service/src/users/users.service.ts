import { Injectable, NotFoundException } from '@nestjs/common';
import { EErrorMessage } from '../common/constants';
import { UserRepository } from './users.repository';
import { createUserDto, SearchUserOffsetDto, updateUserDto } from './dto';
import { getChangedFields } from '../common/helpers';
import { User } from './entities/user.entity';
import { objHasKey } from '../common/helpers';
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
    const existingEntity = await this.userRepository.findByCode(input.id);
    if (!existingEntity) {
      throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND);
    }
    const updatedData = getChangedFields<updateUserDto>(existingEntity, input);
    return await this.userRepository.update(existingEntity, updatedData);
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
  async updatePassword(userId: string, password: string) {
    return this.userRepository.updatePassword(userId, password);
  }
  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
  async findByEmailWithSensitiveInfo(email: string) {
    const fields = this.userRepository.getColsUser();
    const user = await this.userRepository.findByEmail(email, fields);
    return user;
  }
  async updateVerificationStatus(email: string) {
    return await this.userRepository.updateVerificationStatus(email);
  }
  async search(
    offset: SearchUserOffsetDto,
    filters: object | Array<object> = {},
    fields: string[] = [],
  ) {
    let userFields: (keyof User)[] = [];
    if (!Array.isArray(fields) || !fields.length) {
      userFields = this.userRepository.getColsUser();
    } else {
      for (const field of fields) {
        if (objHasKey(User, field)) {
          userFields.push(field as keyof User);
        }
      }
    }
    return await this.userRepository.search(offset, userFields, filters);
  }
}
