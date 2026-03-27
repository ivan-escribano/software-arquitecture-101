import { Request, Response } from 'express';

import { CreateUserUseCase } from '../../application/create-user.use-case';
import { DeleteUserUseCase } from '../../application/delete-user.use-case';
import { FindUserUseCase } from '../../application/find-user.use-case';
import { ListUsersUseCase } from '../../application/list-users.use-case';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private findUserUseCase: FindUserUseCase,
    private listUsersUseCase: ListUsersUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private onBeforeDeleteUser: (userId: string) => Promise<void>,
  ) {}

  async create(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      const user = await this.createUserUseCase.execute(name, email);

      return res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await this.findUserUseCase.execute(req.params.id as string);

      return res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async list(_req: Request, res: Response) {
    try {
      const users = await this.listUsersUseCase.execute();

      return res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      await this.onBeforeDeleteUser(id);
      await this.deleteUserUseCase.execute(id);

      return res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
