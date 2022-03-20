import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../src/modules/common/filters/global-exception-filter.filter';
import { UtilsModule } from './modules/utils/utils.module';
import { UtilService } from './modules/utils/utils.service';

describe('UserController:pagination (e2e)', () => {
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

  it('/v1/users User list successfully retrieved: order by id (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      user,
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
    ];
    usersSavedReadyToRetrieved.sort((a, b) => a.id.localeCompare(b.id));

    return request(app.getHttpServer())
      .get(`/v1/users?order=id&dir=ASC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(usersSavedReadyToRetrieved, {
            order: 'id',
          }),
        );
      });
  });

  it('/v1/users User list successfully retrieved: order by name (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
      user,
    ];
    usersSavedReadyToRetrieved.sort((a, b) => a.name.localeCompare(b.name));

    return request(app.getHttpServer())
      .get(`/v1/users?order=name&dir=ASC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(usersSavedReadyToRetrieved, {
            order: 'name',
          }),
        );
      });
  });

  it('/v1/users User list successfully retrieved: order by email (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
      user,
    ];
    usersSavedReadyToRetrieved.sort((a, b) => a.email.localeCompare(b.email));

    return request(app.getHttpServer())
      .get(`/v1/users?order=email&dir=ASC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(usersSavedReadyToRetrieved, {
            order: 'email',
          }),
        );
      });
  });

  it('/v1/users User list successfully retrieved: order by created_at (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
      user,
    ];
    usersSavedReadyToRetrieved.sort((a, b) =>
      a.created_at.localeCompare(b.created_at),
    );

    return request(app.getHttpServer())
      .get(`/v1/users?order=created_at&dir=ASC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(usersSavedReadyToRetrieved, {
            order: 'created_at',
          }),
        );
      });
  });

  it('/v1/users User list successfully retrieved: order by updated_at (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
      user,
    ];
    usersSavedReadyToRetrieved.sort((a, b) =>
      a.updated_at.localeCompare(b.updated_at),
    );

    return request(app.getHttpServer())
      .get(`/v1/users?order=updated_at&dir=ASC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(usersSavedReadyToRetrieved, {
            order: 'updated_at',
          }),
        );
      });
  });

  it('/v1/users User list successfully retrieved: reverse order by id (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      user,
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
    ];
    usersSavedReadyToRetrieved.sort((a, b) => b.id.localeCompare(a.id));

    return request(app.getHttpServer())
      .get(`/v1/users?order=id&dir=DESC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(usersSavedReadyToRetrieved, {
            order: 'id',
            dir: 'DESC',
          }),
        );
      });
  });

  it('/v1/users User list successfully retrieved: reverse order by name (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      user,
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
    ];
    usersSavedReadyToRetrieved.sort((a, b) => b.name.localeCompare(a.name));

    return request(app.getHttpServer())
      .get(`/v1/users?order=name&dir=DESC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(usersSavedReadyToRetrieved, {
            order: 'name',
            dir: 'DESC',
          }),
        );
      });
  });

  it('/v1/users User list successfully retrieved: reverse order by email (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      user,
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
    ];
    usersSavedReadyToRetrieved.sort((a, b) => b.email.localeCompare(a.email));

    return request(app.getHttpServer())
      .get(`/v1/users?order=email&dir=DESC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(usersSavedReadyToRetrieved, {
            order: 'email',
            dir: 'DESC',
          }),
        );
      });
  });

  it('/v1/users User list successfully retrieved: reverse order by created_at (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      user,
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
    ];
    usersSavedReadyToRetrieved.sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    );

    return request(app.getHttpServer())
      .get(`/v1/users?order=created_at&dir=DESC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(usersSavedReadyToRetrieved, {
            order: 'created_at',
            dir: 'DESC',
          }),
        );
      });
  });

  it('/v1/users User list successfully retrieved: reverse order by updated_at (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      user,
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
    ];
    usersSavedReadyToRetrieved.sort((a, b) =>
      b.updated_at.localeCompare(a.updated_at),
    );

    return request(app.getHttpServer())
      .get(`/v1/users?order=updated_at&dir=DESC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(usersSavedReadyToRetrieved, {
            order: 'updated_at',
            dir: 'DESC',
          }),
        );
      });
  });

  it('/v1/users User list successfully retrieved: limiting the results (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [];

    for (let i = 0; i < 15; i++) {
      usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    }
    usersSavedReadyToRetrieved.push(user);

    usersSavedReadyToRetrieved.sort((a, b) =>
      a.created_at.localeCompare(b.created_at),
    );

    return request(app.getHttpServer())
      .get(`/v1/users?limit=10`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(
            usersSavedReadyToRetrieved.slice(0, 10),
            {
              limit: 10,
              total: usersSavedReadyToRetrieved.length,
            },
          ),
        );
      });
  });

  it('/v1/users User list successfully retrieved: limiting the results and offset (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [];

    for (let i = 0; i < 25; i++) {
      usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    }
    usersSavedReadyToRetrieved.push(user);

    usersSavedReadyToRetrieved.sort((a, b) =>
      a.created_at.localeCompare(b.created_at),
    );

    return request(app.getHttpServer())
      .get(`/v1/users?limit=10&offset=10`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination(
            usersSavedReadyToRetrieved.slice(10, 20),
            {
              total: usersSavedReadyToRetrieved.length,
              limit: 10,
              offset: 10,
            },
          ),
        );
      });
  });

  it('/v1/users Invalid order field (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users?order=invalid`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          code: 'InvalidOrderFieldError',
          error: 'Invalid order field',
          status: 400,
          success: false,
        });
      });
  });

  it('/v1/users Invalid direction (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users?dir=invalid`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          code: 'InvalidOrderDirectionError',
          error: 'Invalid order direction',
          status: 400,
          success: false,
        });
      });
  });
});
