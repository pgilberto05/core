import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => new User(u.id, u.name, u.email, u.password));
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? new User(user.id, user.name, user.email) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? new User(user.id, user.name, user.email) : null;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  async update(id: number, user: User): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: user.name,
        password: user.password,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
