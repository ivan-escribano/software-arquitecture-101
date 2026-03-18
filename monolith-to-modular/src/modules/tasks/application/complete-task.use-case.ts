import { TaskRepository } from '../domain/task.repository';

export class CompleteTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string) {
    const task = await this.taskRepository.findById(id);

    if (!task) throw new Error('Task not found');

    task.complete();

    await this.taskRepository.save(task);

    return task;
  }
}
