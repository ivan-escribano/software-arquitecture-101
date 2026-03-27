import { Request, Response } from 'express';

import { CompleteTaskUseCase } from '../../application/complete-task.use-case';
import { CreateTaskUseCase } from '../../application/create-task.use-case';
import { DeleteTaskUseCase } from '../../application/delete-task.use-case';
import { FindTaskUseCase } from '../../application/find-task.use-case';
import { ListTaskUseCase } from '../../application/list-task.use-case';

interface CreateTaskBody {
  title: string;
}

interface TaskParams {
  id: string;
}

export class TaskController {
  constructor(
    private createTaskUseCase: CreateTaskUseCase,
    private findTaskUseCase: FindTaskUseCase,
    private listTasksUseCase: ListTaskUseCase,
    private completeTaskUseCase: CompleteTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  async create(req: Request<object, object, CreateTaskBody>, res: Response) {
    try {
      const { title } = req.body;

      const task = await this.createTaskUseCase.execute(title);

      return res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  async getById(req: Request<TaskParams>, res: Response) {
    try {
      const { id } = req.params;

      const task = await this.findTaskUseCase.execute(id);

      return res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const tasks = await this.listTasksUseCase.execute();

      return res.status(200).json(tasks);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  async complete(req: Request<TaskParams>, res: Response) {
    try {
      const { id } = req.params;

      const task = await this.completeTaskUseCase.execute(id);

      return res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  async delete(req: Request<TaskParams>, res: Response) {
    try {
      const { id } = req.params;

      await this.deleteTaskUseCase.execute(id);

      return res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
}
