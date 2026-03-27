import { TaskRepository } from '../domain/task.repository';

export class UnassignTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: string) {
    const task = await this.taskRepository.findById(taskId);

    if (!task) throw new Error('Task not found');

    task.unassign();

    await this.taskRepository.save(task);

    return task;
  }
}
