import { TaskRepository } from '../domain/task.repository';

export class AssignTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: string, userId: string | null) {
    const task = await this.taskRepository.findById(taskId);

    if (!task) throw new Error('Task not found');

    task.assign(userId ?? null);

    await this.taskRepository.save(task);

    return task;
  }
}
