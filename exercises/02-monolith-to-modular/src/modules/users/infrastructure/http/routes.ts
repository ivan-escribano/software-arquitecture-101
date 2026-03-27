import { Router } from 'express';

import { UserController } from './user.controller';

export function createRouter(userController: UserController) {
  const router = Router();

  router.post('/users', (req, res) => userController.create(req, res));
  router.get('/users', (req, res) => userController.list(req, res));
  router.get('/users/:id', (req, res) => userController.getById(req, res));
  router.delete('/users/:id', (req, res) => userController.delete(req, res));

  return router;
}
