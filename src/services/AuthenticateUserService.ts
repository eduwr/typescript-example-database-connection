import { getCustomRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';
import { AuthCredentialsDto } from '../utils/dto/authCredentialsDto';
import { UserRepository } from '../repositories/UsersRepository';

interface Response {
  user: User;
  token: string;
}

interface JwtPayload {
  name: string;
}

class AuthenticateUserService {
  public async execute(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<Response> {
    const usersRepository = getCustomRepository(UserRepository);
    const user = await usersRepository.validateUserPassword(authCredentialsDto);

    if (!user) {
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
}

export default AuthenticateUserService;
