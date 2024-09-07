import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  SearchUsersOffsetDto,
  SortUserDto,
  SearchUsersFilterDto,
} from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EErrorMessage, SortOrder } from '../common/constants';
import { getCols } from '../common/helpers';
import { MoreThan, LessThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { fi } from '@faker-js/faker';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(CreateUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: CreateUserDto.email },
    });
    if (user) throw new NotFoundException(EErrorMessage.ENTITY_EXISTED);
    let newUser = this.usersRepository.create({
      ...CreateUserDto,
    });
    newUser = await this.usersRepository.save(newUser);
    delete newUser.password;
    return newUser;
  }
  async remove(userId: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (user) this.usersRepository.delete(user);
  }
  async update(user: User, input: Partial<UpdateUserDto>) {
    if (input.id) {
      delete input['id'];
    }
    const updatedUser = this.usersRepository.create({ ...user, ...input });
    return await this.usersRepository.save(updatedUser);
  }
  async findByCode(userId: string, fields: (keyof User)[] = []) {
    if (!Array.isArray(fields) || !fields.length) {
      fields = getCols(this.usersRepository);
      fields = fields.filter((obj) => obj != 'password');
    }
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: fields,
      relations: {
        role: {
          permission: true,
        },
      },
    });
    return user;
  }
  async updatePassword(userId: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND);
    const updatedUser = this.usersRepository.create({
      ...user,
      password,
    });
    await this.usersRepository.save(updatedUser);
    return true;
  }
  getColsUser() {
    const fields = getCols(this.usersRepository);
    return fields;
  }
  async findByEmail(email: string, fields: (keyof User)[] = []) {
    if (!Array.isArray(fields) || !fields.length) {
      fields = getCols(this.usersRepository);
      fields = fields.filter((obj) => obj != 'password');
    }
    const user = await this.usersRepository.findOne({
      where: { email },
      select: fields,
      relations: {
        role: {
          permission: true,
        },
      },
    });
    return user;
  }
  async updateVerificationStatus(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!user) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND);
    if (user.isVerified)
      throw new NotFoundException('Email has been verified already');
    const updatedUser = this.usersRepository.create({
      ...user,
      isVerified: true,
    });
    await this.usersRepository.save(updatedUser);
    return true;
  }

  async search(
    offset: SearchUsersOffsetDto,
    filters: SearchUsersFilterDto,
    fields: (keyof User)[],
    sort: SortUserDto[],
  ) {
    const { limit, pageNumber, skip } = offset.pagination;
    const { isGetAll } = offset.options ?? {};
    const newFilters = {};
    for (const key in filters) {
      const value = filters[key];
      if (typeof value === 'object' && value !== null) {
        if (value.gte !== null && value.gte !== undefined) {
          filters[key] = MoreThanOrEqual(value.gte);
        } else if (value.gt !== null && value.gt !== undefined) {
          filters[key] = MoreThan(value.gt);
        } else if (value.lte !== null && value.lte !== undefined)
          filters[key] = LessThanOrEqual(value.lte);
        else if (value.lt !== null && value.lt !== undefined)
          filters[key] = LessThan(value.lt);
      }
      const newValues = filters[key];
      const keyValue = key.split('_');
      let o = newFilters;
      for (let i = 0; i < keyValue.length - 1; i++) {
        const prop = keyValue[i];
        o[prop] = o[prop] || {};
        o = o[prop];
      }
      o[keyValue[keyValue.length - 1]] = newValues;
    }
    const sortOrder = {};
    sort.forEach((obj) => {
      const sortOrderBy = obj.orderBy.split('.');
      let object = sortOrder;
      for (let i = 0; i < sortOrderBy.length - 1; i++) {
        const prop = sortOrderBy[i];
        object[prop] = {};
        object = object[prop];
      }
      object[sortOrderBy[sortOrderBy.length - 1]] = obj.order;
    });
    const newFields = fields.filter((obj) => obj != 'password');
    if (isGetAll) {
      const entities = await this.usersRepository.find({
        select: newFields,
        where: newFilters ? newFilters : undefined,
        relations: newFields.includes('role')
          ? { role: { permission: true } }
          : undefined,
        order: sortOrder ? sortOrder : undefined,
      });
      return {
        totalCount: entities.length,
        users: entities,
      };
    }
    const [entities, count] = await this.usersRepository.findAndCount({
      skip: skip || limit * (pageNumber - 1),
      take: limit,
      select: newFields,
      where: newFilters ? newFilters : undefined,
      relations: newFields.includes('role')
        ? { role: { permission: true } }
        : undefined,
      order: sortOrder ? sortOrder : undefined,
    });
    return {
      pageNumber,
      pageSize: limit,
      totalCount: count,
      users: entities,
    };
  }
}
