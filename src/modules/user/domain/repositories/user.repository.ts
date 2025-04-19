import { User } from '../entities/user.entity';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>;
  update(id: number, user: User): Promise<void>;
  delete(id: number): Promise<void>;
}
