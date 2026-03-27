import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(name: string, email: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) throw new Error('Email already in use');

    const user = new User(name, email);

    await this.userRepository.save(user);

    return user;
  }
}
