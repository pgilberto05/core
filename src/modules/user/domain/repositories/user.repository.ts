import { User } from '../entities/user.entity';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  save(user: User): Promise<void>;
  update(id: number, user: User): Promise<void>;
}
