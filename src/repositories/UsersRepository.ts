import { EntityRepository, Repository } from 'typeorm';
import User from '../models/User';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../utils/dto/createUserDto';
import { AuthCredentialsDto } from '../utils/dto/authCredentialsDto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async checkEmail(email: string): Promise<boolean> {
    const userExists = await this.findOne({
      where: { email },
    });

    return !!userExists;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await this.hashPassword(password, salt);
    const user = this.create({
      name,
      email,
      password: hashedPassword,
      salt,
    });

    await this.save(user);
    return user;
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User | null> {
    const { email, password } = authCredentialsDto;
    const user = await this.findOne({ email });

    if (user && (await user.validatePassword(password))) {
      return user;
    } else return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
