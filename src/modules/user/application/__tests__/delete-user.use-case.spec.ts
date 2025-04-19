import { DeleteUserUseCase } from '../../application/delete-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserService } from '../../domain/services/user.service';
import { NotFoundException } from '@nestjs/common';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepo: UserRepository;
  let userService: UserService;

  beforeEach(() => {
    userRepo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    userService = {
      isCorporateEmail: jest.fn(),
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      validateNewUser: jest.fn(),
      calculateUserScore: jest.fn(),
    };

    deleteUserUseCase = new DeleteUserUseCase(userRepo, userService);
  });

  it('should delete the user successfully', async () => {
    const userId = 1;
    jest.spyOn(userRepo, 'delete').mockResolvedValue(undefined);

    await deleteUserUseCase.execute(userId);

    expect(userRepo.delete).toHaveBeenCalledWith(userId);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const userId = 1;

    jest.spyOn(userRepo, 'findById').mockResolvedValue(null);

    try {
      await deleteUserUseCase.execute(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('User not found');
    }
  });
});
