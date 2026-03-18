import { UserRepository } from '../domain/user.repository';

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new Error('User not found');

    await this.userRepository.delete(id);
  }
}
