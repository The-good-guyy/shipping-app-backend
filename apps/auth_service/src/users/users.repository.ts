import { Injectable, NotFoundException } from '@nestjs/common';
import { createUserDto, updateUserDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EErrorMessage } from '../common/constraints';
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
}
