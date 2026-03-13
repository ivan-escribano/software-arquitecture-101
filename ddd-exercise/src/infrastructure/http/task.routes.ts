import { Router } from 'express';

import { TaskController } from './task.controller';

export function createTaskRouter(taskController: TaskController) {
  const router = Router();

  router.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  router.post('/', (req, res) => taskController.create(req, res));

  router.get('/:id', (req, res) => taskController.getById(req, res));

  router.get('/', (req, res) => taskController.list(req, res));

  router.post('/:id/complete', (req, res) => taskController.complete(req, res));

  router.delete('/:id', (req, res) => taskController.delete(req, res));

  return router;
}
