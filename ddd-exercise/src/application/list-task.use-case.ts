import { TaskRepository } from '../domain/task.repository';

export class ListTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute() {
    const tasks = await this.taskRepository.findAll();

    return tasks;
  }
}
