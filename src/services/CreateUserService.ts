import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import { UserRepository } from '../repositories/UsersRepository';
import { CreateUserDto } from '../utils/dto/createUserDto';

class CreateUserService {
  public async execute(createUserDto: CreateUserDto): Promise<User> {
    const usersRepository = getCustomRepository(UserRepository);

    if (await usersRepository.checkEmail(createUserDto.email)) {
      throw new AppError('Email address already used.');
    }
    const user = await usersRepository.createUser(createUserDto);

    return user;
  }
}

export default CreateUserService;
