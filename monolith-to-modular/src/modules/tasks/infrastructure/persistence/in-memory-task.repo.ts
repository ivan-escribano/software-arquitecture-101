import { Task } from '../../domain/task.entity';
import { TaskRepository } from '../../domain/task.repository';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  save(task: Task): Promise<void> {
    const existingIndex = this.tasks.findIndex((item) => item.id === task.id);

    if (existingIndex !== -1) this.tasks[existingIndex] = task;
    else this.tasks.push(task);

    return Promise.resolve();
  }

  findById(id: string): Promise<Task | null> {
    return Promise.resolve(this.tasks.find((item) => item.id === id) || null);
  }

  findAll(): Promise<Task[]> {
    return Promise.resolve([...this.tasks]);
  }

  findByUserId(userId: string): Promise<Task[]> {
    const userTasks = this.tasks.filter((task) => task.userId === userId);

    return Promise.resolve([...userTasks]);
  }

  delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter((item) => item.id !== id);

    return Promise.resolve();
  }
}
