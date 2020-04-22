import { getCustomRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import AppError from '../errors/AppError';

import User from '../models/User';
import { UserRepository } from '../repositories/UsersRepository';
import { CreateUserDto } from '../utils/dto/createUserDto';

class CreateUserService {
  public async execute(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    const usersRepository = getCustomRepository(UserRepository);

    if (await usersRepository.checkEmail(createUserDto.email)) {
      throw new AppError('Email address already used.');
    }

    const salt = await bcrypt.genSalt();
    const hash = await this.hashPassword(password, salt);

    const user = await usersRepository.createUser({
      name,
      email,
      password: hash,
      salt,
    });

    return user;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}

export default CreateUserService;
