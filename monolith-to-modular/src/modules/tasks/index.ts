import { AssignTaskUseCase } from './application/assign-task.use-case';
import { CompleteTaskUseCase } from './application/complete-task.use-case';
import { CreateTaskUseCase } from './application/create-task.use-case';
import { DeleteTaskUseCase } from './application/delete-task.use-case';
import { FindTaskUseCase } from './application/find-task.use-case';
import { GetUserTasksUseCase } from './application/get-user-tasks.use-case';
import { ListTasksUseCase } from './application/list-tasks.use-case';
import { UnassignUserTasksUseCase } from './application/unassign-user-tasks.use-case';
import { createRouter } from './infrastructure/http/routes';
import { TaskController } from './infrastructure/http/task.controller';
import { InMemoryTaskRepository } from './infrastructure/persistence/in-memory-task.repo';

export function createTaskModule() {
  const repository = new InMemoryTaskRepository();

  const createTaskUseCase = new CreateTaskUseCase(repository);
  const findTaskUseCase = new FindTaskUseCase(repository);
  const listTasksUseCase = new ListTasksUseCase(repository);
  const completeTaskUseCase = new CompleteTaskUseCase(repository);
  const deleteTaskUseCase = new DeleteTaskUseCase(repository);
  const assignTaskUseCase = new AssignTaskUseCase(repository);
  const getUserTasksUseCase = new GetUserTasksUseCase(repository);
  const unassignUserTasksUseCase = new UnassignUserTasksUseCase(repository);

  const controller = new TaskController(
    createTaskUseCase,
    findTaskUseCase,
    listTasksUseCase,
    completeTaskUseCase,
    deleteTaskUseCase,
    assignTaskUseCase,
    getUserTasksUseCase,
  );

  const router = createRouter(controller);

  return {
    router,
    unassignByUserId: (userId: string) => unassignUserTasksUseCase.execute(userId),
  };
}
