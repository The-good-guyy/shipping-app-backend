import { Injectable, NotFoundException } from '@nestjs/common';
import { createUserDto, updateUserDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EErrorMessage } from '../common/constraints';
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
    const newUser = this.usersRepository.create({
      ...createUserDto,
    });
    return newUser;
  }
  async remove(userId: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { uuid: userId },
    });
    if (user) this.usersRepository.delete(user);
  }
  async update(userId: string, input: Partial<updateUserDto>) {
    // const user = await this.usersRepository.findOne({
    //   where: { uuid: userId },
    // });
    //   return await this.usersRepository.save({ ...user, ...input });
    return await this.usersRepository.update(userId, input);
  }
  async findByCode(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { uuid: userId },
    });
    if (!user) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND);
    return user;
  }
  async updatePassword(userId: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { uuid: userId },
    });
    if (!user) throw new NotFoundException(EErrorMessage.ENTITY_NOT_FOUND);
    return await this.usersRepository.save({ ...user, password });
  }
}
