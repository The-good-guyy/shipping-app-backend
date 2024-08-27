import { Injectable, NotFoundException } from '@nestjs/common';
import {
  createUserDto,
  updateUserDto,
  SearchUserOffsetDto,
  sortUserDto,
} from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EErrorMessage } from '../common/constants';
import { getCols } from '../common/helpers';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: createUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) throw new NotFoundException(EErrorMessage.ENTITY_EXISTED);
    let newUser = this.usersRepository.create({
      ...createUserDto,
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
  async update(user: User, input: Partial<updateUserDto>) {
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
    offset: SearchUserOffsetDto,
    filter: object | Array<object> = {},
    fields: (keyof User)[],
    sort: sortUserDto[],
  ) {
    const { limit, pageNumber, skip } = offset.pagination;
    const { isGetAll = false } = offset.options ?? {};
    const sortOrder = {};
    sort.forEach((obj) => {
      const sortOrderBy = obj.orderBy.split('.');
      if (sortOrderBy.length == 1) {
        sortOrder[sortOrderBy[0]] = obj.order;
      } else {
        const object = {};
        sortOrder[sortOrderBy[0]] = object;
        let o = object;
        for (let i = 1; i < sortOrderBy.length; i++) {
          if (i == sortOrderBy.length - 1) {
            o[sortOrderBy[i]] = obj.order;
          } else {
            o = o[sortOrderBy[i]] = {};
          }
        }
      }
    });
    const newFields = fields.filter((obj) => obj != 'password');
    if (isGetAll) {
      const entities = await this.usersRepository.find({
        select: newFields,
        where: filter ? filter : undefined,
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
      where: filter ? filter : undefined,
      relations: newFields.includes('role')
        ? { role: { permission: true } }
        : undefined,
      order: { role: { id: 'ASC' } },
    });
    return {
      pageNumber,
      pageSize: limit,
      totalCount: count,
      users: entities,
    };
  }
}
