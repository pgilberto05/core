import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET) debe devolver una lista de usuarios', async () => {
    const res = await request(app.getHttpServer()).get('/users').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/users (POST) debe crear un nuevo usuario', async () => {
    const createUserDto = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: '12345678',
    };

    const res = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(createUserDto.name);
  });

  it('/users/:id (GET) debe devolver un usuario específico', async () => {
    const { body: createdUser } = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Laura',
        email: 'laura@example.com',
        password: '12345678',
      });

    // Luego lo busca por ID
    const res = await request(app.getHttpServer())
      .get(`/users/${createdUser.id}`)
      .expect(200);

    expect(res.body.id).toBe(createdUser.id);
    expect(res.body.name).toBe('Laura');
  });
});
