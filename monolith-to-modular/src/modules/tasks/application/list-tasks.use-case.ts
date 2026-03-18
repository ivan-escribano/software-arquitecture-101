import { TaskRepository } from '../domain/task.repository';

export class ListTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute() {
    return await this.taskRepository.findAll();
  }
}
