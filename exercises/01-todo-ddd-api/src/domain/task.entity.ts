export enum TaskState {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export class Task {
  public readonly id: string;
  public readonly title: string;
  public readonly createdAt: Date;
  private state: TaskState;

  constructor(title: string, state: TaskState = TaskState.PENDING, id?: string, createdAt?: Date) {
    if (!title) throw new Error('Task must have a title');

    if (title.length > 200) throw new Error('Task title cannot exceed 200 characters');

    this.id = id ?? this.generateId();
    this.createdAt = createdAt ?? new Date();

    this.title = title;
    this.state = state;
  }

  complete() {
    if (this.state === TaskState.COMPLETED) throw new Error('Task is already completed');

    this.state = TaskState.COMPLETED;
  }

  getState() {
    return this.state;
  }

  getId() {
    return this.id;
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2, 11);
  }
}
