export enum TaskState {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export class Task {
  public readonly id: string;
  public readonly title: string;
  public readonly createdAt: Date;
  public userId: string | null;
  private state: TaskState;

  constructor(
    title: string,
    userId: string | null = null,
    state: TaskState = TaskState.PENDING,
    id?: string,
    createdAt?: Date,
  ) {
    if (!title) throw new Error('Task must have a title');
    if (title.length > 200) throw new Error('Task title cannot exceed 200 characters');

    this.id = id ?? this.generateId();
    this.createdAt = createdAt ?? new Date();
    this.title = title;
    this.state = state;
    this.userId = userId;
  }

  complete() {
    if (this.state === TaskState.COMPLETED) throw new Error('Task is already completed');
    this.state = TaskState.COMPLETED;
  }

  assign(userId: string | null) {
    if (this.state === TaskState.COMPLETED) throw new Error('Cannot assign a completed task');
    this.userId = userId;
  }

  unassign() {
    if (this.state === TaskState.COMPLETED) throw new Error('Cannot unassign a completed task');

    this.userId = null;
  }

  getState() {
    return this.state;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      state: this.state,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2, 11);
  }
}
