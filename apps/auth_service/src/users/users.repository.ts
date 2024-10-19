import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  SortUserDto,
  SearchUsersFilterDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EErrorMessage } from 'libs/common/error';
import { getCols } from 'libs/common/helpers';
import { ILike, Repository } from 'typeorm';
import { filterHandle, sortHandle } from '../common/helper';
import { Role } from '../role/entities/role.entity';
import { SearchOffsetPaginationDto } from '../common/dto';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
    if (!user) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND);
    await this.usersRepository.delete(user);
  }
  async update(user: User, input: Partial<UpdateUserDto>) {
    if (input.id) {
      delete input['id'];
    }
    const updatedUser = this.usersRepository.create({ ...user, ...input });
    return await this.usersRepository.save(updatedUser);
  }
  async updateRole(user: User, role: Role) {
    const updatedUser = this.usersRepository.create({
      ...user,
      role: role,
    });
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
    if (!user) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND);
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
    if (!user) throw new NotFoundException(EErrorMessage.USER_NOT_FOUND);
    if (user.isVerified)
      throw new NotFoundException(EErrorMessage.EMAIL_ALREADY_VERIFIED);
    const updatedUser = this.usersRepository.create({
      ...user,
      isVerified: true,
    });
    await this.usersRepository.save(updatedUser);
    return true;
  }
  async updateVerifiedStatus(user: User, isVerified: boolean) {
    const updatedUser = this.usersRepository.create({
      ...user,
      isVerified,
    });
    return await this.usersRepository.save(updatedUser);
  }
  async search(
    offset: SearchOffsetPaginationDto,
    filters: SearchUsersFilterDto,
    fields: (keyof User)[],
    sort: SortUserDto[],
    search: string,
  ) {
    // console.log('fields', fields);
    const { limit, pageNumber, skip } = offset.pagination;
    const { isGetAll } = offset.options ?? {};
    const newFields = fields.filter((obj) => obj != 'password');
    const newFilters = filterHandle(filters);
    const sortOrder = sortHandle(sort);
    const newFilterGroup = search
      ? [
          { username: ILike(`%${search}%`), ...newFilters },
          { email: ILike(`%${search}%`), ...newFilters },
        ]
      : newFilters;
    if (isGetAll) {
      const entities = await this.usersRepository.find({
        select: newFields,
        where: newFilterGroup ? newFilterGroup : undefined,
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
      where: newFilterGroup ? newFilterGroup : undefined,
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
