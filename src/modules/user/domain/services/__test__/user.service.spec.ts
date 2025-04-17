import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { UserService } from '../user.service';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe('isCorporateEmail', () => {
    it('should return true for corporate email', () => {
      expect(service.isCorporateEmail('john@empresa.com')).toBe(true);
    });

    it('should return false for non-corporate email', () => {
      expect(service.isCorporateEmail('john@gmail.com')).toBe(false);
    });
  });

  describe('hashPassword', () => {
    it('should hash password using bcrypt', async () => {
      const hashMock = jest.fn().mockResolvedValue('hashed123');
      (bcrypt.hash as jest.Mock) = hashMock;

      const result = await service.hashPassword('password123');
      expect(hashMock).toHaveBeenCalledWith('password123', 10);
      expect(result).toBe('hashed123');
    });
  });

  describe('comparePasswords', () => {
    it('should return true if passwords match', async () => {
      const compareMock = jest.fn().mockResolvedValue(true);
      (bcrypt.compare as jest.Mock) = compareMock;

      const result = await service.comparePasswords('123', 'hashed123');
      expect(compareMock).toHaveBeenCalledWith('123', 'hashed123');
      expect(result).toBe(true);
    });
  });

  describe('validateNewUser', () => {
    it('should throw error if email is not corporate', () => {
      const user = new User(1, 'Juan', 'juan@gmail.com', '123');
      expect(() => service.validateNewUser(user)).toThrow(
        'Solo se permiten correos corporativos',
      );
    });

    it('should throw error if name is too short', () => {
      const user = new User(1, 'Jo', 'jo@empresa.com', '123');
      expect(() => service.validateNewUser(user)).toThrow(
        'El nombre es demasiado corto',
      );
    });

    it('should not throw error for valid user', () => {
      const user = new User(1, 'Carlos', 'carlos@empresa.com', '123');
      expect(() => service.validateNewUser(user)).not.toThrow();
    });
  });

  describe('calculateUserScore', () => {
    it('should return 100 for perfect user', () => {
      const user = new User(1, 'Perfecto', 'perfecto@empresa.com', '123');
      expect(service.calculateUserScore(user)).toBe(100);
    });

    it('should deduct 50 for non-corporate email', () => {
      const user = new User(1, 'Perfecto', 'perfecto@gmail.com', '123');
      expect(service.calculateUserScore(user)).toBe(50);
    });

    it('should deduct 25 for short name', () => {
      const user = new User(1, 'Luis', 'luis@empresa.com', '123');
      expect(service.calculateUserScore(user)).toBe(75);
    });

    it('should deduct 75 if both email and name are invalid', () => {
      const user = new User(1, 'Ana', 'ana@gmail.com', '123');
      expect(service.calculateUserScore(user)).toBe(25);
    });
  });
});
