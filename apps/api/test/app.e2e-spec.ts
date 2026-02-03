import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import cookieParser from 'cookie-parser';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let authToken: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [
            () => ({
              MONGO_URI: mongoUri,
              JWT_SECRET: 'test-secret',
              JWT_EXPIRES_IN: '15m',
              NODE_ENV: 'test',
              CORS_ORIGIN: 'http://localhost:3000',
            }),
          ],
        }),
        MongooseModule.forRoot(mongoUri),
        AuthModule,
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('/api/auth/signup (POST)', () => {
    it('should create a new user with valid data', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          name: 'Test User',
          password: 'Password123!',
        })
        .expect(201)
        .expect((res: any) => {
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.email).toBe('test@example.com');
          expect(res.body.user.name).toBe('Test User');
          expect(res.headers['set-cookie']).toBeDefined();
          expect(res.headers['set-cookie'][0]).toContain('easyauth_token');
        });
    });

    it('should return 400 for weak password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'weak@example.com',
          name: 'Weak User',
          password: 'weak',
        })
        .expect(400)
        .expect((res: any) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toEqual(expect.any(Array));
        });
    });

    it('should return 400 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'invalid-email',
          name: 'Invalid User',
          password: 'Password123!',
        })
        .expect(400)
        .expect((res: any) => {
          expect(res.body.statusCode).toBe(400);
        });
    });

    it('should return 400 for short name', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'short@example.com',
          name: 'AB',
          password: 'Password123!',
        })
        .expect(400)
        .expect((res: any) => {
          expect(res.body.statusCode).toBe(400);
        });
    });

    it('should return 409 for duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          name: 'Duplicate User',
          password: 'Password123!',
        })
        .expect(409)
        .expect((res: any) => {
          expect(res.body.message).toBe('Email already exists');
        });
    });
  });

  describe('/api/auth/signin (POST)', () => {
    it('should sign in with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(200)
        .expect((res: any) => {
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.email).toBe('test@example.com');
          expect(res.headers['set-cookie']).toBeDefined();
          const cookie = res.headers['set-cookie'][0];
          expect(cookie).toContain('easyauth_token');
          authToken = cookie.split(';')[0].split('=')[1];
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401)
        .expect((res: any) => {
          expect(res.body.message).toBe('Invalid credentials');
        });
    });
  });

  describe('/api/auth/me (GET)', () => {
    it('should return 401 without cookie', () => {
      return request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });

    it('should return user with valid cookie', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Cookie', `easyauth_token=${authToken}`)
        .expect(200)
        .expect((res: any) => {
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.email).toBe('test@example.com');
          expect(res.body.user.name).toBe('Test User');
        });
    });
  });

  describe('/api/auth/protected (GET)', () => {
    it('should return 200 with valid cookie', () => {
      return request(app.getHttpServer())
        .get('/api/auth/protected')
        .set('Cookie', `easyauth_token=${authToken}`)
        .expect(200)
        .expect((res: any) => {
          expect(res.body.message).toBe('This is a protected route');
        });
    });
  });

  describe('/api/auth/logout (POST)', () => {
    it('should clear cookie', () => {
      return request(app.getHttpServer())
        .post('/api/auth/logout')
        .expect(200)
        .expect((res: any) => {
          expect(res.body.message).toBe('Logged out successfully');
          expect(res.headers['set-cookie']).toBeDefined();
          expect(res.headers['set-cookie'][0]).toContain('Max-Age=0');
        });
    });
  });
});
