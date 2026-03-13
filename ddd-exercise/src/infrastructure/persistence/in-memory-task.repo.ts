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
    const task = this.tasks.find((item) => item.id === id);

    return Promise.resolve(task || null);
  }

  findAll(): Promise<Task[]> {
    const tasksCopy = [...this.tasks];

    return Promise.resolve(tasksCopy);
  }

  delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter((item) => item.id !== id);

    return Promise.resolve();
  }
}
