import { TaskRepository } from '../domain/task.repository';

export class UnassignUserTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(userId: string) {
    const tasks = await this.taskRepository.findByUserId(userId);

    for (const task of tasks) {
      task.unassign();
      await this.taskRepository.save(task);
    }
  }
}
