import { CreateUserUseCase } from './application/create-user.use-case';
import { DeleteUserUseCase } from './application/delete-user.use-case';
import { FindUserUseCase } from './application/find-user.use-case';
import { ListUsersUseCase } from './application/list-users.use-case';
import { createRouter } from './infrastructure/http/routes';
import { UserController } from './infrastructure/http/user.controller';
import { InMemoryUserRepository } from './infrastructure/persistence/in-memory-user.repo';

export function createUserModule(onBeforeDeleteUser: (userId: string) => Promise<void>) {
  const repository = new InMemoryUserRepository();

  const createUserUseCase = new CreateUserUseCase(repository);
  const findUserUseCase = new FindUserUseCase(repository);
  const listUsersUseCase = new ListUsersUseCase(repository);
  const deleteUserUseCase = new DeleteUserUseCase(repository);

  const controller = new UserController(
    createUserUseCase,
    findUserUseCase,
    listUsersUseCase,
    deleteUserUseCase,
    onBeforeDeleteUser,
  );

  const router = createRouter(controller);

  return {
    router,
    findById: (id: string) => findUserUseCase.execute(id),
  };
}
