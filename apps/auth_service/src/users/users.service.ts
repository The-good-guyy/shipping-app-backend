import { Injectable, NotFoundException } from '@nestjs/common';
import { EErrorMessage, UserFilterSearch } from '../common/constants';
import { UserRepository } from './users.repository';
import {
  CreateUserDto,
  SearchUsersFilterDto,
  SearchUsersOffsetDto,
  SortUserDto,
  UpdateUserDto,
} from './dto';
import { getChangedFields } from '../common/helpers';
import { User } from './entities/user.entity';
import { stringToEnum } from '../common/helpers';
import {
  SortOrder,
  UserOrderBySearch,
  UserFieldSearch,
} from '../common/constants';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(input: CreateUserDto) {
    const newUser = await this.userRepository.create(input);
    return newUser;
  }
  async remove(userId: string): Promise<void> {
    await this.userRepository.findByCode(userId);
    await this.userRepository.remove(userId);
  }
  async update(input: UpdateUserDto) {
    const existingEntity = await this.userRepository.findByCode(input.id);
    if (!existingEntity) {
      throw new NotFoundException(EErrorMessage.USER_NOT_FOUND);
    }
    const updatedData = getChangedFields<UpdateUserDto>(existingEntity, input);
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
    offset: SearchUsersOffsetDto,
    filters: object,
    fields: string[],
    sort: { orderBy: string; order: string }[],
  ) {
    const userCols = this.userRepository.getColsUser();
    let userFields = fields.filter(
      (field) =>
        userCols.includes(field as keyof User) &&
        stringToEnum(UserFieldSearch, field),
    ) as (keyof User)[];
    userFields = userFields.length > 0 ? userFields : userCols;
    let sortObj: SortUserDto[] = [];
    if (!Array.isArray(sort) || !sort.length) {
      sortObj = [new SortUserDto()];
    } else {
      for (const obj of sort) {
        const { orderBy, order } = obj;
        if (stringToEnum(UserOrderBySearch, orderBy)) {
          sortObj.push({
            orderBy: stringToEnum(UserOrderBySearch, orderBy),
            order: stringToEnum(SortOrder, order) || SortOrder.desc,
          });
        }
      }
    }
    sortObj = sortObj.length > 0 ? sortObj : [new SortUserDto()];
    const filtersObject = new SearchUsersFilterDto();
    for (const k in filters) {
      if (stringToEnum(UserFilterSearch, k)) {
        filtersObject[k] = filters[k];
      }
    }
    return await this.userRepository.search(
      offset,
      filtersObject,
      userFields,
      sortObj,
    );
  }
}
