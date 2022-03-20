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

describe('CustomerController:filters (e2e)', () => {
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

  it('/v1/customers Customer list successfully retrieved: filter by id (GET)', async () => {
    const { user, access_token } = await utilService.getUserSigned({});
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_id=${customersSavedReadyToRetrieved[0].id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination([
            customersSavedReadyToRetrieved[0],
          ]),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: filter by name (GET)', async () => {
    const { user, access_token } = await utilService.getUserSigned({});
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user, {
        name: 'Customer 1',
      }),
      await utilService.insertRandomCustomer(user, {
        name: 'Customer 2',
      }),
      await utilService.insertRandomCustomer(user, {
        name: 'Customer 3',
      }),
    ];

    return request(app.getHttpServer())
      .get(
        `/v1/customers?filter_name=${customersSavedReadyToRetrieved[0].name}`,
      )
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination([
            customersSavedReadyToRetrieved[0],
          ]),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: filter by surname (GET)', async () => {
    const { user, access_token } = await utilService.getUserSigned({});
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user, {
        surname: 'Customer 1',
      }),
      await utilService.insertRandomCustomer(user, {
        surname: 'Customer 2',
      }),
      await utilService.insertRandomCustomer(user, {
        surname: 'Customer 3',
      }),
    ];

    return request(app.getHttpServer())
      .get(
        `/v1/customers?filter_surname=${customersSavedReadyToRetrieved[0].surname}`,
      )
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination([
            customersSavedReadyToRetrieved[0],
          ]),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: filter by external_id (GET)', async () => {
    const { user, access_token } = await utilService.getUserSigned({});
    const customersSavedReadyToRetrieved = [
      await utilService.insertRandomCustomer(user, {
        external_id: 'Customer 1',
      }),
      await utilService.insertRandomCustomer(user, {
        external_id: 'Customer 2',
      }),
      await utilService.insertRandomCustomer(user, {
        external_id: 'Customer 3',
      }),
    ];

    return request(app.getHttpServer())
      .get(
        `/v1/customers?filter_external_id=${customersSavedReadyToRetrieved[0].external_id}`,
      )
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination([
            customersSavedReadyToRetrieved[0],
          ]),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: filter by created_at (GET)', async () => {
    const { user, access_token } = await utilService.getUserSigned({});
    const customersSavedReadyToRetrieved = [];
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    await new Promise((resolve) => setTimeout(resolve, 150));
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    await new Promise((resolve) => setTimeout(resolve, 150));
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );

    return request(app.getHttpServer())
      .get(
        `/v1/customers?filter_created_at=${customersSavedReadyToRetrieved[0].created_at}`,
      )
      .set('Authorization', `Bearer ${access_token}`)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination([
            customersSavedReadyToRetrieved[0],
          ]),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: filter by updated_at (GET)', async () => {
    const { user, access_token } = await utilService.getUserSigned({});
    const customersSavedReadyToRetrieved = [];
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    await new Promise((resolve) => setTimeout(resolve, 150));
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    await new Promise((resolve) => setTimeout(resolve, 150));
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );

    return request(app.getHttpServer())
      .get(
        `/v1/customers?filter_updated_at=${customersSavedReadyToRetrieved[0].updated_at}`,
      )
      .set('Authorization', `Bearer ${access_token}`)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination([
            customersSavedReadyToRetrieved[0],
          ]),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: filter by filter_created_at[from] (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [];
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    await new Promise((resolve) => setTimeout(resolve, 150));
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    const filterCreatedAtFrom = new Date(
      Date.parse(customersSavedReadyToRetrieved[0].created_at) + 75,
    ).toISOString();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_created_at_from=${filterCreatedAtFrom}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination([
            customersSavedReadyToRetrieved[1],
          ]),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: filter by filter_created_at[to] (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [];
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    await new Promise((resolve) => setTimeout(resolve, 150));
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    const filterCreatedAtTo = new Date(
      Date.parse(customersSavedReadyToRetrieved[0].created_at) + 75,
    ).toISOString();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_created_at_to=${filterCreatedAtTo}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination([
            customersSavedReadyToRetrieved[0],
          ]),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: filter by filter_updated_at[from] (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [];
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    await new Promise((resolve) => setTimeout(resolve, 150));
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    const filterUpdatedAtFrom = new Date(
      Date.parse(customersSavedReadyToRetrieved[0].updated_at) + 75,
    ).toISOString();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_updated_at_from=${filterUpdatedAtFrom}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination([
            customersSavedReadyToRetrieved[1],
          ]),
        );
      });
  });

  it('/v1/customers Customer list successfully retrieved: filter by filter_updated_at[to] (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customersSavedReadyToRetrieved = [];
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    await new Promise((resolve) => setTimeout(resolve, 150));
    customersSavedReadyToRetrieved.push(
      await utilService.insertRandomCustomer(user),
    );
    const filterUpdatedAtTo = new Date(
      Date.parse(customersSavedReadyToRetrieved[0].updated_at) + 75,
    ).toISOString();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_updated_at_to=${filterUpdatedAtTo}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual(
          utilService.mapCustomersWithPagination([
            customersSavedReadyToRetrieved[0],
          ]),
        );
      });
  });

  it('/v1/customers Id must be a uuid (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers/123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          status: 400,
          success: false,
          code: 'IdMustBeAUuidError',
          error: 'Id must be a uuid',
        });
      });
  });

  it('/v1/customers Created by must be a uuid (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_created_by=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          status: 400,
          success: false,
          code: 'CreatedByMustBeAUuidError',
          error: 'Created by must be a uuid',
        });
      });
  });

  it('/v1/customers Updated by must be a uuid (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_updated_by=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          status: 400,
          success: false,
          code: 'UpdatedByMustBeAUuidError',
          error: 'Updated by must be a uuid',
        });
      });
  });

  it('/v1/customers Created by[email] must be a email (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_created_by_email=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          status: 400,
          success: false,
          code: 'CreatedByEmailMustBeAValidEmailError',
          error: 'Created by[email] must be a valid email',
        });
      });
  });

  it('/v1/customers Updated by[email] must be a email (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_updated_by_email=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          status: 400,
          success: false,
          code: 'UpdatedByEmailMustBeAValidEmailError',
          error: 'Updated by[email] must be a valid email',
        });
      });
  });

  it('/v1/customers Created at must be a date (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_created_at=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          status: 400,
          success: false,
          code: 'CreatedAtMustBeADateError',
          error: 'Created at must be a date',
        });
      });
  });

  it('/v1/customers Updated at must be a date (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_updated_at=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          status: 400,
          success: false,
          code: 'UpdatedAtMustBeADateError',
          error: 'Updated at must be a date',
        });
      });
  });

  it('/v1/customers Created at[from] must be a date (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_created_at_from=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          status: 400,
          success: false,
          code: 'CreatedAtFromMustBeADateError',
          error: 'Created at[from] must be a date',
        });
      });
  });

  it('/v1/customers Created at[to] must be a date (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers?filter_created_at_to=123`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          status: 400,
          success: false,
          code: 'CreatedAtToMustBeADateError',
          error: 'Created at[to] must be a date',
        });
      });
  });
});
