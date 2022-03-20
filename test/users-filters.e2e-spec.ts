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

describe('UserController:filters (e2e)', () => {
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

  it('/v1/users User list successfully retrieved: filter by id (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
    ];

    return request(app.getHttpServer())
      .get(`/v1/users?filter_id=${usersSavedReadyToRetrieved[0].id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[0]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: filter by name (GET)', async () => {
    const { access_token } = await utilService.getUserSigned({
      name: 'User 1',
    });
    const usersSavedReadyToRetrieved = [
      await utilService.insertRandomUser({ name: 'User 2' }),
      await utilService.insertRandomUser({ name: 'User 3' }),
    ];

    return request(app.getHttpServer())
      .get(`/v1/users?filter_name=${usersSavedReadyToRetrieved[0].name}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[0]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: filter by surname (GET)', async () => {
    const { access_token } = await utilService.getUserSigned({
      surname: 'User 1',
    });
    const usersSavedReadyToRetrieved = [
      await utilService.insertRandomUser({ surname: 'User 2' }),
      await utilService.insertRandomUser({ surname: 'User 3' }),
    ];

    return request(app.getHttpServer())
      .get(`/v1/users?filter_surname=${usersSavedReadyToRetrieved[0].surname}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[0]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: filter by email (GET)', async () => {
    const { access_token } = await utilService.getUserSigned({
      email: 'user1@crm.josemanuelcarretero.me',
    });
    const usersSavedReadyToRetrieved = [
      await utilService.insertRandomUser({
        email: 'user2@crm.josemanuelcarretero.me',
      }),
      await utilService.insertRandomUser({
        email: 'user3@crm.josemanuelcarretero.me',
      }),
    ];

    return request(app.getHttpServer())
      .get(`/v1/users?filter_email=${usersSavedReadyToRetrieved[0].email}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[0]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: filter by type (GET)', async () => {
    const { access_token } = await utilService.getUserSigned({
      type: 'admin',
    });
    const usersSavedReadyToRetrieved = [
      await utilService.insertRandomUser({ type: 'user' }),
      await utilService.insertRandomUser({ type: 'admin' }),
    ];

    return request(app.getHttpServer())
      .get(`/v1/users?filter_type=${usersSavedReadyToRetrieved[0].type}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[0]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: filter by created_at (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const usersSavedReadyToRetrieved = [];
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    await new Promise((resolve) => setTimeout(resolve, 150));
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());

    return request(app.getHttpServer())
      .get(
        `/v1/users?filter_created_at=${usersSavedReadyToRetrieved[0].created_at}`,
      )
      .set('Authorization', `Bearer ${access_token}`)
      .then((response) => {
        console.log(response.body);
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[0]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: filter by updated_at (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const usersSavedReadyToRetrieved = [];
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    await new Promise((resolve) => setTimeout(resolve, 150));
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());

    return request(app.getHttpServer())
      .get(
        `/v1/users?filter_updated_at=${usersSavedReadyToRetrieved[0].updated_at}`,
      )
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[0]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: filter by filter_created_at[from] (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const usersSavedReadyToRetrieved = [];
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    await new Promise((resolve) => setTimeout(resolve, 150));
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    const filterCreatedAtFrom = new Date(
      Date.parse(usersSavedReadyToRetrieved[0].created_at) + 75,
    ).toISOString();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_created_at_from=${filterCreatedAtFrom}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[1]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: filter by filter_created_at[to] (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const usersSavedReadyToRetrieved = [];
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    await new Promise((resolve) => setTimeout(resolve, 150));
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    const filterCreatedAtTo = new Date(
      Date.parse(usersSavedReadyToRetrieved[0].created_at) + 75,
    ).toISOString();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_created_at_to=${filterCreatedAtTo}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([
            user,
            usersSavedReadyToRetrieved[0],
          ]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: filter by filter_updated_at[from] (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const usersSavedReadyToRetrieved = [];
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    await new Promise((resolve) => setTimeout(resolve, 150));
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    const filterUploadAtFrom = new Date(
      Date.parse(usersSavedReadyToRetrieved[0].created_at) + 75,
    ).toISOString();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_updated_at_from=${filterUploadAtFrom}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[1]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: filter by filter_updated_at[to] (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    await new Promise((resolve) => setTimeout(resolve, 150));
    const usersSavedReadyToRetrieved = [];
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    await new Promise((resolve) => setTimeout(resolve, 150));
    usersSavedReadyToRetrieved.push(await utilService.insertRandomUser());
    const filterUploadAtTo = new Date(
      Date.parse(usersSavedReadyToRetrieved[0].created_at) + 75,
    ).toISOString();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_updated_at_to=${filterUploadAtTo}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([
            user,
            usersSavedReadyToRetrieved[0],
          ]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: partial search in id (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const usersSavedReadyToRetrieved = [];
    usersSavedReadyToRetrieved.push(
      await utilService.insertRandomUser(),
      await utilService.insertRandomUser(),
    );
    let query = user.id.substring(0, user.id.length - 1);
    let expected = user;
    const query1 = query;
    const query2 = usersSavedReadyToRetrieved[0].id.substring(
      0,
      user.id.length - 1,
    );
    const query3 = usersSavedReadyToRetrieved[1].id.substring(
      0,
      user.id.length - 1,
    );

    if (query1 === query2 && query1 === query3) {
      query = user.id;
    } else if (query1 === query2) {
      query = query3;
      expected = usersSavedReadyToRetrieved[1];
    } else if (query1 === query3) {
      query = query2;
      expected = usersSavedReadyToRetrieved[0];
    }

    return request(app.getHttpServer())
      .get(`/v1/users?query=${query}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(utilService.mapUsersWithPagination([expected]));
      });
  });
  /*
  it('/v1/users User list successfully retrieved: partial search in name (GET)', async () => {
    const { access_token } = await utilService.getUserSigned({
      name: 'Manuel Jesus',
      surname: 'Gutierrez Alba',
      email: 'manuel.gutierrez@test.com',
    });
    const usersSavedReadyToRetrieved = [];
    usersSavedReadyToRetrieved.push(
      await utilService.insertRandomUser({
        name: 'María José',
        surname: 'Gonzalez Garcia',
        email: 'maria.gonzalez@test.com',
      }),
    );
    usersSavedReadyToRetrieved.push(
      await utilService.insertRandomUser({
        name: 'Eduardo',
        surname: 'Hernandez Pérez',
        email: 'eduardo.hernandez@test.com',
      }),
    );
    const query = usersSavedReadyToRetrieved[0].name.split(' ')[0];

    return request(app.getHttpServer())
      .get(`/v1/users?query=${query}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[0]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: partial search in surname (GET)', async () => {
    const { access_token } = await utilService.getUserSigned({
      name: 'Manuel Jesus',
      surname: 'Gutierrez Alba',
      email: 'manuel.gutierrez@test.com',
    });
    const usersSavedReadyToRetrieved = [];
    usersSavedReadyToRetrieved.push(
      await utilService.insertRandomUser({
        name: 'María José',
        surname: 'Gonzalez Garcia',
        email: 'maria.gonzalez@test.com',
      }),
    );
    usersSavedReadyToRetrieved.push(
      await utilService.insertRandomUser({
        name: 'Eduardo',
        surname: 'Hernandez Pérez',
        email: 'eduardo.hernandez@test.com',
      }),
    );
    const query = usersSavedReadyToRetrieved[0].surname.split(' ')[0];

    return request(app.getHttpServer())
      .get(`/v1/users?query=${query}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[0]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: partial search in email (GET)', async () => {
    const { access_token } = await utilService.getUserSigned({
      name: 'Manuel Jesus',
      surname: 'Gutierrez Alba',
      email: 'manuel.gutierrez@test.com',
    });
    const usersSavedReadyToRetrieved = [];
    usersSavedReadyToRetrieved.push(
      await utilService.insertRandomUser({
        name: 'María José',
        surname: 'Gonzalez Garcia',
        email: 'maria.gonzalez@test.com',
      }),
    );
    usersSavedReadyToRetrieved.push(
      await utilService.insertRandomUser({
        name: 'Eduardo',
        surname: 'Hernandez Pérez',
        email: 'eduardo.hernandez@test.com',
      }),
    );
    const query = usersSavedReadyToRetrieved[0].email.split('@')[0];

    return request(app.getHttpServer())
      .get(`/v1/users?query=${query}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([usersSavedReadyToRetrieved[0]]),
        );
      });
  });

  it('/v1/users User list successfully retrieved: multiple partial search in name, surname and email (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned({
      name: 'Manuel Jesus 123',
      surname: 'Gutierrez Alba',
      email: 'manuel.gutierrez@test.com',
    });
    const usersSavedReadyToRetrieved = [];
    usersSavedReadyToRetrieved.push(
      await utilService.insertRandomUser({
        name: 'María José',
        surname: 'Gonzalez Garcia 123',
        email: 'maria.gonzalez@test.com',
      }),
    );
    usersSavedReadyToRetrieved.push(
      await utilService.insertRandomUser({
        name: 'Eduardo',
        surname: 'Hernandez Pérez',
        email: 'eduardo.hernandez123@test.com',
      }),
    );
    const query = '123';

    return request(app.getHttpServer())
      .get(`/v1/users?query=${query}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapUsersWithPagination([
            user,
            usersSavedReadyToRetrieved[0],
            usersSavedReadyToRetrieved[1],
          ]),
        );
      });
  });

  it('/v1/users Id must be a uuid (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_id=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Id must be a uuid',
          code: 'IdMustBeAUuidError',
          status: 400,
        });
      });
  });

  it('/v1/users Email must be a valid email (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_email=123`)
      .set('Authorization', `Bearer ${access_token}`)
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

  it('/v1/users User type must be a valid type (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_type=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'User type must be a valid type',
          code: 'UserTypeMustBeAValidTypeError',
          status: 400,
        });
      });
  });

  it('/v1/users Created at must be a date (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_created_at=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Created at must be a date',
          code: 'CreatedAtMustBeADateError',
          status: 400,
        });
      });
  });

  it('/v1/users Updated at must be a date (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_updated_at=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Updated at must be a date',
          code: 'UpdatedAtMustBeADateError',
          status: 400,
        });
      });
  });

  it('/v1/users Created at[from] must be a date (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_created_at_from=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Created at[from] must be a date',
          code: 'CreatedAtFromMustBeADateError',
          status: 400,
        });
      });
  });

  it('/v1/users Created at[to] must be a date (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_created_at_to=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Created at[to] must be a date',
          code: 'CreatedAtToMustBeADateError',
          status: 400,
        });
      });
  });

  it('/v1/users Updated at[from] must be a date (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_updated_at_from=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Updated at[from] must be a date',
          code: 'UpdatedAtFromMustBeADateError',
          status: 400,
        });
      });
  });

  it('/v1/users Updated at[to] must be a date (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/users?filter_updated_at_to=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Updated at[to] must be a date',
          code: 'UpdatedAtToMustBeADateError',
          status: 400,
        });
      });
  });*/
});
