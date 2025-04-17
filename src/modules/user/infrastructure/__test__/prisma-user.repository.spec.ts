import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../domain/entities/user.entity';
import { PrismaUserRepository } from '../persistence/prisma-user.repository';
import { PrismaService } from '../../../../prisma/prisma.service';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaUserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get(PrismaUserRepository);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Test',
        email: 'test@empresa.com',
      });

      const result = await repository.findById(1);

      expect(result).toBeInstanceOf(User);
      expect(result?.name).toBe('Test');
    });

    it('should return null when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await repository.findById(99);
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 2,
        name: 'Ana',
        email: 'ana@empresa.com',
      });

      const result = await repository.findByEmail('ana@empresa.com');

      expect(result).toBeInstanceOf(User);
      expect(result?.email).toBe('ana@empresa.com');
    });
  });

  describe('save', () => {
    it('should call prisma.create with correct data', async () => {
      const user = new User(0, 'Luis', 'luis@empresa.com', '1234');
      await repository.save(user);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Luis',
          email: 'luis@empresa.com',
          password: '1234',
        },
      });
    });
  });

  describe('update', () => {
    it('should call prisma.update with correct data', async () => {
      const user = new User(1, 'Carlos', 'carlos@empresa.com', 'secret');
      const dateMock = jest.spyOn(Date, 'now').mockReturnValue(1234567890000);

      await repository.update(1, user);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Carlos',
          password: 'secret',
          updatedAt: expect.any(Date),
        },
      });

      dateMock.mockRestore();
    });
  });

  describe('delete', () => {
    it('should call prisma.delete with correct id', async () => {
      await repository.delete(10);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 10 } });
    });
  });
});
