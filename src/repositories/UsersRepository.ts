import { EntityRepository, Repository } from 'typeorm';
import User from '../models/User';
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
    const user = this.create(createUserDto);
    await this.save(user);
    return user;
  }
}
