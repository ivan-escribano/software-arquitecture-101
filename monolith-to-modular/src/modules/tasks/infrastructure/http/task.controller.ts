import { Request, Response } from 'express';

import { AssignTaskUseCase } from '../../application/assign-task.use-case';
import { CompleteTaskUseCase } from '../../application/complete-task.use-case';
import { CreateTaskUseCase } from '../../application/create-task.use-case';
import { DeleteTaskUseCase } from '../../application/delete-task.use-case';
import { FindTaskUseCase } from '../../application/find-task.use-case';
import { GetUserTasksUseCase } from '../../application/get-user-tasks.use-case';
import { ListTasksUseCase } from '../../application/list-tasks.use-case';

export class TaskController {
  constructor(
    private createTaskUseCase: CreateTaskUseCase,
    private findTaskUseCase: FindTaskUseCase,
    private listTasksUseCase: ListTasksUseCase,
    private completeTaskUseCase: CompleteTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
    private assignTaskUseCase: AssignTaskUseCase,
    private getUserTasksUseCase: GetUserTasksUseCase,
  ) {}

  async create(req: Request, res: Response) {
    try {
      const { title, userId } = req.body;

      const task = await this.createTaskUseCase.execute(title, userId);

      return res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const task = await this.findTaskUseCase.execute(req.params.id as string);

      return res.status(200).json(task);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async list(_req: Request, res: Response) {
    try {
      const tasks = await this.listTasksUseCase.execute();

      return res.status(200).json(tasks);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async complete(req: Request, res: Response) {
    try {
      const task = await this.completeTaskUseCase.execute(req.params.id as string);

      return res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.deleteTaskUseCase.execute(req.params.id as string);

      return res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async assign(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      const task = await this.assignTaskUseCase.execute(req.params.id as string, userId);

      return res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getUserTasks(req: Request, res: Response) {
    try {
      const tasks = await this.getUserTasksUseCase.execute(req.params.userId as string);

      return res.status(200).json(tasks);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }
}
