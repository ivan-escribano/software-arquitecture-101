export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly createdAt: Date;

  constructor(name: string, email: string, id?: string, createdAt?: Date) {
    if (!name) throw new Error('User must have a name');

    if (!email) throw new Error('User must have an email');

    if (!email.includes('@')) throw new Error('Invalid email format');

    this.id = id ?? this.generateId();
    this.createdAt = createdAt ?? new Date();
    this.name = name;
    this.email = email;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
    };
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2, 11);
  }
}
