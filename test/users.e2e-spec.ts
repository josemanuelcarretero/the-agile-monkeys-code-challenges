import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Repository } from 'typeorm';
import { User } from '../src/modules/user/models/user.model';
import { UserType } from '../src/modules/user/enums/user-type.enum';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../src/modules/common/filters/global-exception-filter.filter';
import { v4 as uuid } from 'uuid';
import { UtilsModule } from './modules/utils/utils.module';
import { UtilService } from './modules/utils/utils.service';

describe('UserController (e2e)', () => {
  let app: NestFastifyApplication;
  let userRepository: Repository<User>;
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

    userRepository = app.get('UserRepository');
    utilService = app.get(UtilService);

    await utilService.clearDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/users User successfully created (POST)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.generateRandomUser();
    await userRepository.delete({ email: user.email });

    return request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send(user)
      .expect(201)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: true,
          message: 'User successfully created',
          code: 'UserSuccessfullyCreatedResponse',
          data: {
            ...user,
            password: undefined,
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        });
      });
  });

  it('/v1/users/:id User successfully updated (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const userToUpdated = await utilService.generateRandomUser();
    const userToUpdatedWithNewData = await utilService.generateRandomUser();
    await userRepository.delete({ email: userToUpdated.email });
    const userSavedReadyToUpdated = await utilService.insertRandomUser(
      userToUpdated,
    );

    return request(app.getHttpServer())
      .put(`/v1/users/${userSavedReadyToUpdated.id}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send(userToUpdatedWithNewData)
      .then((response) => {
        const { body } = response;
        console.log(body);
        expect(response.status).toBe(200);
        expect(body).toEqual({
          success: true,
          message: 'User successfully updated',
          code: 'UserSuccessfullyUpdatedResponse',
          data: {
            id: userSavedReadyToUpdated.id,
            name: userToUpdatedWithNewData.name,
            email: userToUpdatedWithNewData.email,
            surname: userToUpdatedWithNewData.surname,
            type: userToUpdatedWithNewData.type,
            created_at: userSavedReadyToUpdated.created_at,
            updated_at: expect.any(String),
          },
        });
      });
  });

  it('/v1/users/:id User successfully retrieved (GET)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .get(`/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: true,
          message: 'User successfully retrieved',
          code: 'UserSuccessfullyRetrievedResponse',
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            surname: user.surname,
            type: user.type,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        });
      });
  });

  it('/v1/users/:id User successfully deleted (DELETE)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.generateRandomUser();
    await userRepository.delete({ email: user.email });
    const userSavedReadyToDeleted = await utilService.insertRandomUser(user);

    return request(app.getHttpServer())
      .delete(`/v1/users/${userSavedReadyToDeleted.id}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: true,
          message: 'User successfully deleted',
          code: 'UserSuccessfullyDeletedResponse',
          data: true,
        });
      });
  });

  it('/v1/users User list successfully retrieved (GET)', async () => {
    await utilService.clearDatabase();
    const userSigned = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
    ];

    return request(app.getHttpServer())
      .get(`/v1/users`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: true,
          message: 'User list successfully retrieved',
          code: 'UserListSuccessfullyRetrievedResponse',
          data: [
            {
              id: userSigned.id,
              name: userSigned.name,
              email: userSigned.email,
              surname: userSigned.surname,
              type: userSigned.type,
              created_at: userSigned.created_at,
              updated_at: userSigned.updated_at,
            },
            {
              id: usersSavedReadyToRetrieved[0].id,
              name: usersSavedReadyToRetrieved[0].name,
              email: usersSavedReadyToRetrieved[0].email,
              surname: usersSavedReadyToRetrieved[0].surname,
              type: usersSavedReadyToRetrieved[0].type,
              created_at: usersSavedReadyToRetrieved[0].created_at,
              updated_at: usersSavedReadyToRetrieved[0].updated_at,
            },
            {
              id: usersSavedReadyToRetrieved[1].id,
              name: usersSavedReadyToRetrieved[1].name,
              email: usersSavedReadyToRetrieved[1].email,
              surname: usersSavedReadyToRetrieved[1].surname,
              type: usersSavedReadyToRetrieved[1].type,
              created_at: usersSavedReadyToRetrieved[1].created_at,
              updated_at: usersSavedReadyToRetrieved[1].updated_at,
            },
          ],
          order: {
            dir: 'ASC',
            order: 'created_at',
          },
          pagination: {
            length: 3,
            limit: 20,
            offset: 0,
            total: 3,
          },
        });
      });
  });

  it('/v1/users User already exists (POST)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .post(`/v1/users`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: userSigned.email,
        password: user.password,
        surname: user.surname,
        type: user.type,
      })
      .expect(409)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'User already exists',
          code: 'UserAlreadyExistsError',
          status: 409,
        });
      });
  });

  it('/v1/users/:id User already exists (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: userSigned.email,
        password: user.password,
        surname: user.surname,
        type: user.type,
      })
      .expect(409)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'User already exists',
          code: 'UserAlreadyExistsError',
          status: 409,
        });
      });
  });

  it('/v1/users/:id User not found (GET)', async () => {
    const userSigned = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'User not found',
          code: 'UserNotFoundError',
          status: 404,
        });
      });
  });

  it('/v1/users/:id User not found (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: user.password,
        surname: user.surname,
        type: user.type,
      })
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'User not found',
          code: 'UserNotFoundError',
          status: 404,
        });
      });
  });

  it('/v1/users/:id User not found (DELETE)', async () => {
    const userSigned = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .delete(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'User not found',
          code: 'UserNotFoundError',
          status: 404,
        });
      });
  });

  it('/v1/users/:id Name must be a string (POST)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.generateRandomUser();

    return request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: 123,
        email: user.email,
        password: user.password,
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Name must be a string',
          code: 'NameMustBeAStringError',
          status: 400,
        });
      });
  });

  it('/v1/users/:id Name must be a string (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.generateRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: 123,
        email: user.email,
        password: user.password,
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Name must be a string',
          code: 'NameMustBeAStringError',
          status: 400,
        });
      });
  });

  it('/v1/users Surname must be a string (POST)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: user.password,
        surname: 123,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Surname must be a string',
          code: 'SurnameMustBeAStringError',
          status: 400,
        });
      });
  });

  it('/v1/users/:id Surname must be a string (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: user.password,
        surname: 123,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Surname must be a string',
          code: 'SurnameMustBeAStringError',
          status: 400,
        });
      });
  });

  it('/v1/users Email must be a valid email (POST)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: 'email',
        password: user.password,
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Email must be a valid email',
          code: 'EmailMustBeAValidEmailError',
          status: 400,
        });
      });
  });

  it('/v1/users/:id Email must be a valid email (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: 'email',
        password: user.password,
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Email must be a valid email',
          code: 'EmailMustBeAValidEmailError',
          status: 400,
        });
      });
  });

  it('/v1/users Password must be a string (POST)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: 123,
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Password must be a string',
          code: 'PasswordMustBeAStringError',
          status: 400,
        });
      });
  });

  it('/v1/users/:id Password must be a string (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: 123,
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Password must be a string',
          code: 'PasswordMustBeAStringError',
          status: 400,
        });
      });
  });

  it("/v1/users Type must be a valid user type: 'admin' or 'user' (POST)", async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: user.password,
        surname: user.surname,
        type: 'not-valid',
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: "Type must be a valid user type: 'admin' or 'user'",
          code: 'TypeMustBeAValidUserTypeError',
          status: 400,
        });
      });
  });

  it("/v1/users/:id Type must be a valid user type: 'admin' or 'user' (PUT)", async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: user.password,
        surname: user.surname,
        type: 'not-valid',
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: "Type must be a valid user type: 'admin' or 'user'",
          code: 'TypeMustBeAValidUserTypeError',
          status: 400,
        });
      });
  });

  it('/v1/users Name should not be empty (POST)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: '',
        email: user.email,
        password: user.password,
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Name should not be empty',
          code: 'NameShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/users/:id Name should not be empty (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: '',
        email: user.email,
        password: user.password,
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Name should not be empty',
          code: 'NameShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/users Surname should not be empty (POST)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: user.password,
        surname: '',
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Surname should not be empty',
          code: 'SurnameShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/users/:id Surname should not be empty (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: user.password,
        surname: '',
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Surname should not be empty',
          code: 'SurnameShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/users Email should not be empty (POST)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: '',
        password: user.password,
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Email should not be empty',
          code: 'EmailShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/users/:id Email should not be empty (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: '',
        password: user.password,
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Email should not be empty',
          code: 'EmailShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/users Password should not be empty (POST)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.insertRandomUser();

    return request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: '',
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Password should not be empty',
          code: 'PasswordShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/users/:id Password should not be empty (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.generateRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: '',
        surname: user.surname,
        type: user.type,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Password should not be empty',
          code: 'PasswordShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/users Type should not be empty (POST)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.generateRandomUser();

    return request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: user.password,
        surname: user.surname,
        type: '',
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Type should not be empty',
          code: 'TypeShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/users/:id Type should not be empty (PUT)', async () => {
    const userSigned = await utilService.getUserSigned();
    const user = await utilService.generateRandomUser();

    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .send({
        name: user.name,
        email: user.email,
        password: user.password,
        surname: user.surname,
        type: '',
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Type should not be empty',
          code: 'TypeShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/users Not authenticated (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/v1/users/${uuid()}`)
      .expect(401)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Not authenticated',
          code: 'NotAuthenticatedError',
          status: 401,
        });
      });
  });

  it('/v1/users/:id Not authenticated (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/v1/users/${uuid()}`)
      .expect(401)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Not authenticated',
          code: 'NotAuthenticatedError',
          status: 401,
        });
      });
  });

  it('/v1/users Not authenticated (POST)', async () => {
    return request(app.getHttpServer())
      .post('/v1/users')
      .expect(401)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Not authenticated',
          code: 'NotAuthenticatedError',
          status: 401,
        });
      });
  });

  it('/v1/users/:id Not authenticated (PUT)', async () => {
    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .expect(401)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Not authenticated',
          code: 'NotAuthenticatedError',
          status: 401,
        });
      });
  });

  it('/v1/users/:id Not authenticated (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`/v1/users/${uuid()}`)
      .expect(401)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Not authenticated',
          code: 'NotAuthenticatedError',
          status: 401,
        });
      });
  });

  it('/v1/users Not allowed for this type of user (GET)', async () => {
    const userSigned = await utilService.getUserSigned({ type: UserType.USER });

    return request(app.getHttpServer())
      .get(`/v1/users`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .expect(403)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Not allowed for this type of user',
          code: 'NotAllowedForThisTypeOfUserError',
          status: 403,
        });
      });
  });

  it('/v1/users/:id Not allowed for this type of user (GET)', async () => {
    const userSigned = await utilService.getUserSigned({ type: UserType.USER });

    return request(app.getHttpServer())
      .get(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .expect(403)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Not allowed for this type of user',
          code: 'NotAllowedForThisTypeOfUserError',
          status: 403,
        });
      });
  });

  it('/v1/users Not allowed for this type of user (POST)', async () => {
    const userSigned = await utilService.getUserSigned({ type: UserType.USER });

    return request(app.getHttpServer())
      .post(`/v1/users`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .expect(403)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Not allowed for this type of user',
          code: 'NotAllowedForThisTypeOfUserError',
          status: 403,
        });
      });
  });

  it('/v1/users/:id Not allowed for this type of user (PUT)', async () => {
    const userSigned = await utilService.getUserSigned({ type: UserType.USER });

    return request(app.getHttpServer())
      .put(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .expect(403)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Not allowed for this type of user',
          code: 'NotAllowedForThisTypeOfUserError',
          status: 403,
        });
      });
  });

  it('/v1/users/:id Not allowed for this type of user (DELETE)', async () => {
    const userSigned = await utilService.getUserSigned({ type: UserType.USER });

    return request(app.getHttpServer())
      .delete(`/v1/users/${uuid()}`)
      .set('Authorization', `Bearer ${userSigned.access_token}`)
      .expect(403)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Not allowed for this type of user',
          code: 'NotAllowedForThisTypeOfUserError',
          status: 403,
        });
      });
  });
});
