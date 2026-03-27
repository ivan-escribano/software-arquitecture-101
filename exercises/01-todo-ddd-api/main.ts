import express from 'express';

//! USE CASES: APP LAYER | ORCHESTRATION LAYER OF SPECIFIC USE CASES
import { CompleteTaskUseCase } from './src/application/complete-task.use-case';
import { CreateTaskUseCase } from './src/application/create-task.use-case';
import { DeleteTaskUseCase } from './src/application/delete-task.use-case';
import { FindTaskUseCase } from './src/application/find-task.use-case';
import { ListTaskUseCase } from './src/application/list-task.use-case';
//! INFRASTRUCTURE: FRAMEWORKS, DRIVERS, EXTERNAL SERVICES(DATABASE , EXPRESS etc.)
import { TaskController } from './src/infrastructure/http/task.controller';
import { createTaskRouter } from './src/infrastructure/http/task.routes';
import { InMemoryTaskRepository } from './src/infrastructure/persistence/in-memory-task.repo';

const app = express();

app.use(express.json());

const taskRepository = new InMemoryTaskRepository();

const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const findTaskUseCase = new FindTaskUseCase(taskRepository);
const listTaskUseCase = new ListTaskUseCase(taskRepository);
const completeTaskUseCase = new CompleteTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

const taskController = new TaskController(
  createTaskUseCase,
  findTaskUseCase,
  listTaskUseCase,
  completeTaskUseCase,
  deleteTaskUseCase,
);

app.use('/api/tasks', createTaskRouter(taskController));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
