import { TaskRepository } from '../domain/task.repository';

export class GetUserTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(userId: string | null) {
    if (!userId) throw new Error('User ID is required');

    return await this.taskRepository.findByUserId(userId);
  }
}
