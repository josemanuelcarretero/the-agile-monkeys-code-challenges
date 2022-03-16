import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../src/modules/common/filters/global-exception-filter.filter';
import * as faker from 'faker';
import { UtilsModule } from './modules/utils/utils.module';
import { UtilService } from './modules/utils/utils.service';
import { before } from '@nestjs/swagger/dist/plugin';

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication;
  let utilService: UtilService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.registerAsync(true), UtilsModule],
      providers: [],
      exports: [],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    utilService = app.get(UtilService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await utilService.clearDatabase();
  });

  it('/auth/in Login successfully (POST)', async () => {
    const user = await utilService.getUserSigned();

    await request(app.getHttpServer())
      .post('/v1/auth/in')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(201)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: true,
          message: 'Login successfully',
          code: 'LoginSuccessfullyResponse',
          data: {
            ...user,
            password: undefined,
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            access_token: expect.any(String),
          },
        });
      });
  });

  it('/auth/in Password does not match (POST)', async () => {
    const user = await utilService.insertRandomUser();

    await request(app.getHttpServer())
      .post('/v1/auth/in')
      .send({
        email: user.email,
        password: 'invalid-password',
      })
      .expect(409)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          code: 'PasswordDoesNotMatchError',
          error: 'Password does not match',
          status: 409,
        });
      });
  });

  it('/auth/in User not found (POST)', async () => {
    const user = await utilService.generateRandomUser();

    await request(app.getHttpServer())
      .post('/v1/auth/in')
      .send({
        email: 'not-fount+' + user.email,
        password: user.password,
      })
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          code: 'UserNotFoundError',
          error: 'User not found',
          status: 404,
        });
      });
  });

  it('/auth/in Password should not be empty (POST)', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/in')
      .send({
        email: faker.internet.email(),
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          code: 'PasswordShouldNotBeEmptyError',
          error: 'Password should not be empty',
          status: 400,
        });
      });
  });

  it('/auth/in Email should not be empty (POST)', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/in')
      .send({
        password: faker.internet.password(),
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          code: 'EmailShouldNotBeEmptyError',
          error: 'Email should not be empty',
          status: 400,
        });
      });
  });

  it('/auth/in Email should be valid (POST)', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/in')
      .send({
        email: 'invalid-email',
        password: faker.internet.password(),
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          code: 'EmailMustBeAValidEmailError',
          error: 'Email must be a valid email',
          status: 400,
        });
      });
  });

  it('/auth/in Password must be a string (POST)', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/in')
      .send({
        email: faker.internet.email(),
        password: 123,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          code: 'PasswordMustBeAStringError',
          error: 'Password must be a string',
          status: 400,
        });
      });
  });
});
