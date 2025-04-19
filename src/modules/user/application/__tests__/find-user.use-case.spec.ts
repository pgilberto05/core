import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { FindUserUseCase } from '../find-user.use-case';

describe('FindUserUseCase', () => {
  let useCase: FindUserUseCase;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepo = {
      findById: jest.fn(),
    } as any;

    useCase = new FindUserUseCase(mockUserRepo);
  });

  it('debería retornar un usuario si existe', async () => {
    const user = new User(
      1,
      'Test',
      'test@email.com',
      'hashed',
      new Date(),
      new Date(),
    );

    mockUserRepo.findById.mockResolvedValue(user);

    const result = await useCase.execute(1);

    expect(result).toEqual(user);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(1);
  });

  it('debería retornar null si el usuario no existe', async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(99);

    expect(result).toBeNull();
    expect(mockUserRepo.findById).toHaveBeenCalledWith(99);
  });
});
