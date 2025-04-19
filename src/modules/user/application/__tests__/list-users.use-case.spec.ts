import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { ListUserUseCase } from '../list-users.use-case';

describe('ListUsersUseCase', () => {
  let useCase: ListUserUseCase;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepo = {
      findAll: jest.fn(),
    } as any;

    useCase = new ListUserUseCase(mockUserRepo);
  });

  it('debería retornar una lista de usuarios', async () => {
    const users: User[] = [
      new User(
        1,
        'Alice',
        'alice@email.com',
        new Date().toISOString(),
        new Date(),
      ),
      new User(2, 'Bob', 'bob@email.com', new Date().toISOString(), new Date()),
    ];

    mockUserRepo.findAll.mockResolvedValue(users);

    const result = await useCase.execute();

    expect(result).toEqual(users);
    expect(mockUserRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('debería retornar una lista vacía si no hay usuarios', async () => {
    mockUserRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(mockUserRepo.findAll).toHaveBeenCalledTimes(1);
  });
});
