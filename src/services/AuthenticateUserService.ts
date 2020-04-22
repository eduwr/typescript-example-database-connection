import { getCustomRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';
import { AuthCredentialsDto } from '../utils/dto/authCredentialsDto';
import { UserRepository } from '../repositories/UsersRepository';
import { compare, hash } from 'bcryptjs';

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<Response> {
    const { email, password } = authCredentialsDto;
    const usersRepository = getCustomRepository(UserRepository);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = this.validatePassword(password, user);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }

  private async validatePassword(
    password: string,
    user: User,
  ): Promise<boolean> {
    const hashPassword = await hash(password, user.salt);
    return hashPassword === user.password;
  }
}

export default AuthenticateUserService;
