import express from 'express';

import { createTaskModule } from './tasks';
import { createUserModule } from './users';

const app = express();

app.use(express.json());

const taskModule = createTaskModule();
const userModule = createUserModule(
  async (userId) => taskModule.unassignByUserId(userId),
);

app.use('/api', taskModule.router);
app.use('/api', userModule.router);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
