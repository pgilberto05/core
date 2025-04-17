import { UserRepository } from '../../domain/repositories/user.repository';
import { UserService } from '../../domain/services/user.service';
import { CreateUserUseCase } from '../create-user.use-case';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserService: jest.Mocked<UserService>;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserService = {
      hashPassword: jest.fn(),
      validateNewUser: jest.fn(),
    } as any;

    mockUserRepo = {
      save: jest.fn(),
    } as any;

    useCase = new CreateUserUseCase(mockUserRepo, mockUserService);
  });

  it('should hash the password, validate the user, and save it', async () => {
    // Arrange
    const name = 'Juan';
    const email = 'juan@example.com';
    const password = '123456';
    const hashedPassword = 'hashed123';

    mockUserService.hashPassword.mockResolvedValue(hashedPassword);

    // Act
    await useCase.execute(name, email, password);

    // Assert
    expect(mockUserService.hashPassword).toHaveBeenCalledWith(password);
    expect(mockUserService.validateNewUser).toHaveBeenCalledWith(
      expect.objectContaining({
        name,
        email,
        password: hashedPassword,
      }),
    );
    expect(mockUserRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name,
        email,
        password: hashedPassword,
      }),
    );
  });
});
