import { UserRepository } from '../domain/user.repository';

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    return await this.userRepository.findAll();
  }
}
