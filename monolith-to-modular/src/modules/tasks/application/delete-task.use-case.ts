import { TaskRepository } from '../domain/task.repository';

export class DeleteTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string) {
    const task = await this.taskRepository.findById(id);

    if (!task) throw new Error('Task not found');

    await this.taskRepository.delete(id);
  }
}
