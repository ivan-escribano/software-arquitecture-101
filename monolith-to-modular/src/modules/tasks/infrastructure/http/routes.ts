import { Router } from 'express';

import { TaskController } from './task.controller';

export function createRouter(taskController: TaskController) {
  const router = Router();

  // Task routes
  router.post('/tasks', (req, res) => taskController.create(req, res));
  router.get('/tasks', (req, res) => taskController.list(req, res));
  router.get('/tasks/:id', (req, res) => taskController.getById(req, res));
  router.get('/users/:userId/tasks', (req, res) => taskController.getUserTasks(req, res));
  router.patch('/tasks/:id/complete', (req, res) => taskController.complete(req, res));
  router.patch('/tasks/:id/assign', (req, res) => taskController.assign(req, res));
  router.delete('/tasks/:id', (req, res) => taskController.delete(req, res));

  return router;
}
