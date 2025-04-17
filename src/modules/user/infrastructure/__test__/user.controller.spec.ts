import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../../application/create-user.use-case';
import { UserController } from '../controllers/user.controller';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should call createUserUseCase.execute with correct arguments', async () => {
    const dto = { name: 'Juan', email: 'juan@empresa.com', password: '1234' };
    await controller.create(dto);
    expect(createUserUseCase.execute).toHaveBeenCalledWith(
      dto.name,
      dto.email,
      dto.password,
    );
  });

  it('should return a success message', async () => {
    const dto = { name: 'Ana', email: 'ana@empresa.com', password: 'abcd' };
    const response = await controller.create(dto);
    expect(response).toEqual({ message: 'User created' });
  });
});
