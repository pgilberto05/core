import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserService } from '../../domain/services/user.service';
import { UpdateUserUseCase } from '../update-user.use-case';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let userRepo: jest.Mocked<UserRepository>;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: 'UserRepository',
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            hashPassword: jest.fn(),
            validateNewUser: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(UpdateUserUseCase);
    userRepo = module.get('UserRepository');
    userService = module.get(UserService);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(1, {
        name: 'Test',
        email: 'test@email.com',
        password: '123456',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update user with hashed password if provided', async () => {
    const existingUser = new User(1, 'Old', 'old@email.com', 'oldpass');
    const newUser = {
      name: 'New',
      email: 'new@email.com',
      password: 'newpass',
    };

    userRepo.findById.mockResolvedValue(existingUser);
    userService.hashPassword.mockResolvedValue('hashedpass');

    await useCase.execute(1, newUser);

    expect(userService.hashPassword).toHaveBeenCalledWith('newpass');
    expect(userService.validateNewUser).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: 'New',
        email: 'new@email.com',
        password: 'hashedpass',
      }),
    );
    expect(userRepo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        id: 1,
        name: 'New',
        email: 'new@email.com',
        password: 'hashedpass',
      }),
    );
  });

  it('should keep old password if new one is not provided', async () => {
    const existingUser = new User(1, 'Old', 'old@email.com', 'oldpass');
    const newUser = {
      name: 'New',
      email: 'new@email.com',
      password: undefined,
    }; // No password

    userRepo.findById.mockResolvedValue(existingUser);

    await useCase.execute(1, newUser);

    expect(userService.hashPassword).not.toHaveBeenCalled();
    expect(userService.validateNewUser).toHaveBeenCalled();
    expect(userRepo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        id: 1,
        name: 'New',
        email: 'new@email.com',
        password: 'oldpass',
      }),
    );
  });
});
