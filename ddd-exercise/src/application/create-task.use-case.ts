import { Task } from '../domain/task.entity';
import { TaskRepository } from '../domain/task.repository';

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(title: string) {
    const task = new Task(title);

    await this.taskRepository.save(task);

    return task;
  }
}
