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

describe('CustomerController:pagination (e2e)', () => {
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

  it('/v1/customers Customer list successfully retrieved: order by id (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];
    customersSavedReadyToRetrieved.sort((a, b) => a.id.localeCompare(b.id));

    return request(app.getHttpServer())
      .get(`/v1/customers?order=id`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination(
            customersSavedReadyToRetrieved,
            {
              order: 'id',
            },
          ),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: order by name (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];
    customersSavedReadyToRetrieved.sort((a, b) => a.name.localeCompare(b.name));

    return request(app.getHttpServer())
      .get(`/v1/customers?order=name`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination(
            customersSavedReadyToRetrieved,
            {
              order: 'name',
            },
          ),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: order by surname (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];
    customersSavedReadyToRetrieved.sort((a, b) =>
      a.surname.localeCompare(b.surname),
    );

    return request(app.getHttpServer())
      .get(`/v1/customers?order=surname`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination(
            customersSavedReadyToRetrieved,
            {
              order: 'surname',
            },
          ),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: order by external_id (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];
    customersSavedReadyToRetrieved.sort((a, b) =>
      a.external_id.localeCompare(b.external_id),
    );

    return request(app.getHttpServer())
      .get(`/v1/customers?order=external_id`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination(
            customersSavedReadyToRetrieved,
            {
              order: 'external_id',
            },
          ),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: order by created_at (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];
    customersSavedReadyToRetrieved.sort((a, b) =>
      a.created_at.localeCompare(b.created_at),
    );

    return request(app.getHttpServer())
      .get(`/v1/customers?order=created_at`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination(
            customersSavedReadyToRetrieved,
            {
              order: 'created_at',
            },
          ),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: order by updated_at (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];
    customersSavedReadyToRetrieved.sort((a, b) =>
      a.updated_at.localeCompare(b.updated_at),
    );

    return request(app.getHttpServer())
      .get(`/v1/customers?order=updated_at`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination(
            customersSavedReadyToRetrieved,
            {
              order: 'updated_at',
            },
          ),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: reverse order by name (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];
    customersSavedReadyToRetrieved.sort((a, b) => a.name.localeCompare(b.name));
    customersSavedReadyToRetrieved.reverse();

    return request(app.getHttpServer())
      .get(`/v1/customers?order=name&dir=DESC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination(
            customersSavedReadyToRetrieved,
            {
              order: 'name',
              dir: 'DESC',
            },
          ),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: reverse order by surname (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];
    customersSavedReadyToRetrieved.sort((a, b) =>
      a.surname.localeCompare(b.surname),
    );
    customersSavedReadyToRetrieved.reverse();

    return request(app.getHttpServer())
      .get(`/v1/customers?order=surname&dir=DESC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination(
            customersSavedReadyToRetrieved,
            {
              order: 'surname',
              dir: 'DESC',
            },
          ),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: reverse order by created_at (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];
    customersSavedReadyToRetrieved.sort((a, b) =>
      a.created_at.localeCompare(b.created_at),
    );
    customersSavedReadyToRetrieved.reverse();

    return request(app.getHttpServer())
      .get(`/v1/customers?order=created_at&dir=DESC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination(
            customersSavedReadyToRetrieved,
            {
              order: 'created_at',
              dir: 'DESC',
            },
          ),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: reverse order by updated_at (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];
    customersSavedReadyToRetrieved.sort((a, b) =>
      a.updated_at.localeCompare(b.updated_at),
    );
    customersSavedReadyToRetrieved.reverse();

    return request(app.getHttpServer())
      .get(`/v1/customers?order=updated_at&dir=DESC`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination(
            customersSavedReadyToRetrieved,
            {
              order: 'updated_at',
              dir: 'DESC',
            },
          ),
        );
      });
  });

  it('/v1/customers Invalid order field (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers?order=invalid`)
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

  it('/v1/customers Invalid order direction (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers?order=name&dir=invalid`)
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
