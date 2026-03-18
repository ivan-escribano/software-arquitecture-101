import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  save(user: User): Promise<void> {
    const existingIndex = this.users.findIndex((item) => item.id === user.id);

    if (existingIndex !== -1) this.users[existingIndex] = user;
    else this.users.push(user);

    return Promise.resolve();
  }

  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.find((item) => item.id === id) || null);
  }

  findAll(): Promise<User[]> {
    return Promise.resolve([...this.users]);
  }

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.users.find((item) => item.email === email) || null);
  }

  delete(id: string): Promise<void> {
    this.users = this.users.filter((item) => item.id !== id);
    return Promise.resolve();
  }
}
