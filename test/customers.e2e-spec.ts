import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Repository } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../src/modules/common/filters/global-exception-filter.filter';
import { v4 as uuid } from 'uuid';
import { Customer } from '../src/modules/customer/models/customer.model';
import { UtilsModule } from './modules/utils/utils.module';
import { UtilService } from './modules/utils/utils.service';

describe('CustomerController (e2c)', () => {
  let app: NestFastifyApplication;
  let customerRepository: Repository<Customer>;
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

    customerRepository = app.get('CustomerRepository');
    utilService = app.get(UtilService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await utilService.clearDatabase();
  });

  it('/v1/customers Customer successfully created (POST)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer();
    await customerRepository.delete({ external_id: customer.external_id });

    return request(app.getHttpServer())
      .post('/v1/customers')
      .set('Authorization', `Bearer ${access_token}`)
      .send(customer)
      .expect(201)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: true,
          message: 'Customer successfully created',
          code: 'CustomerSuccessfullyCreatedResponse',
          data: {
            id: expect.any(String),
            name: customer.name,
            surname: customer.surname,
            external_id: customer.external_id,
            image: customer.image,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            created_by: {
              id: user.id,
              name: user.name,
              surname: user.surname,
              email: user.email,
              type: user.type,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
            updated_by: {
              id: user.id,
              name: user.name,
              surname: user.surname,
              email: user.email,
              type: user.type,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
          },
        });
      });
  });

  it('/v1/customers/:id Customer successfully updated (PUT)', async () => {
    const { user, access_token } = await utilService.getUserSigned();
    const otherUser = await utilService.insertRandomUser();
    const customer = await utilService.insertRandomCustomer(otherUser);
    const newDataForCustomer = await utilService.generateRandomCustomer();
    await customerRepository.delete({
      external_id: newDataForCustomer.external_id,
    });

    return request(app.getHttpServer())
      .put(`/v1/customers/${customer.id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(newDataForCustomer)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: true,
          message: 'Customer successfully updated',
          code: 'CustomerSuccessfullyUpdatedResponse',
          data: {
            id: customer.id,
            name: newDataForCustomer.name,
            surname: newDataForCustomer.surname,
            external_id: newDataForCustomer.external_id,
            image: newDataForCustomer.image,
            created_at: customer.created_at,
            updated_at: expect.any(String),
            created_by: {
              id: otherUser.id,
              name: otherUser.name,
              surname: otherUser.surname,
              email: otherUser.email,
              type: otherUser.type,
              created_at: otherUser.created_at,
              updated_at: otherUser.updated_at,
            },
            updated_by: {
              id: user.id,
              name: user.name,
              surname: user.surname,
              email: user.email,
              type: user.type,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
          },
        });
      });
  });

  it('/v1/customers/:id Customer successfully retrieved (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.insertRandomCustomer(user);

    return request(app.getHttpServer())
      .get(`/v1/customers/${customer.id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: true,
          message: 'Customer successfully retrieved',
          code: 'CustomerSuccessfullyRetrievedResponse',
          data: {
            id: customer.id,
            name: customer.name,
            surname: customer.surname,
            external_id: customer.external_id,
            image: customer.image,
            created_at: customer.created_at,
            updated_at: customer.updated_at,
            created_by: {
              id: user.id,
              name: user.name,
              surname: user.surname,
              email: user.email,
              type: user.type,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
            updated_by: {
              id: user.id,
              name: user.name,
              surname: user.surname,
              email: user.email,
              type: user.type,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
          },
        });
      });
  });

  it('/v1/customers/:id Customer successfully deleted (DELETE)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.insertRandomCustomer(user);

    return request(app.getHttpServer())
      .delete(`/v1/customers/${customer.id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: true,
          message: 'Customer successfully deleted',
          code: 'CustomerSuccessfullyDeletedResponse',
          data: true,
        });
      });
  });

  it('/v1/customers Customer list successfully retrieved (GET)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = [
      await utilService.insertRandomCustomer(user),
      await utilService.insertRandomCustomer(user),
    ];

    return request(app.getHttpServer())
      .get(`/v1/customers`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: true,
          message: 'Customer list successfully retrieved',
          code: 'CustomerListSuccessfullyRetrievedResponse',
          data: [
            {
              id: customer[0].id,
              name: customer[0].name,
              surname: customer[0].surname,
              external_id: customer[0].external_id,
              image: customer[0].image,
              created_at: customer[0].created_at,
              updated_at: customer[0].updated_at,
              created_by: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                type: user.type,
                created_at: user.created_at,
                updated_at: user.updated_at,
              },
              updated_by: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                type: user.type,
                created_at: user.created_at,
                updated_at: user.updated_at,
              },
            },
            {
              id: customer[1].id,
              name: customer[1].name,
              surname: customer[1].surname,
              external_id: customer[1].external_id,
              image: customer[1].image,
              created_at: customer[1].created_at,
              updated_at: customer[1].updated_at,
              created_by: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                type: user.type,
                created_at: user.created_at,
                updated_at: user.updated_at,
              },
              updated_by: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                type: user.type,
                created_at: user.created_at,
                updated_at: user.updated_at,
              },
            },
          ],
          order: {
            dir: 'ASC',
            order: 'created_at',
          },
          pagination: {
            length: 2,
            limit: 20,
            offset: 0,
            total: 2,
          },
        });
      });
  });

  it('/v1/customers Customer already exists (POST)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.insertRandomCustomer(user);

    return request(app.getHttpServer())
      .post(`/v1/customers`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: customer.surname,
        external_id: customer.external_id,
        image: customer.image,
      })
      .expect(409)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Customer already exists',
          code: 'CustomerAlreadyExistsError',
          status: 409,
        });
      });
  });

  it('/v1/customers/:id Customer already exists (PUT)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customerSavedReadyToUpdate = await utilService.insertRandomCustomer(
      user,
    );
    const customerSavedReadyToThrowConflict =
      await utilService.insertRandomCustomer(user);

    return request(app.getHttpServer())
      .put(`/v1/customers/${customerSavedReadyToUpdate.id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customerSavedReadyToThrowConflict.name,
        surname: customerSavedReadyToThrowConflict.surname,
        external_id: customerSavedReadyToThrowConflict.external_id,
        image: customerSavedReadyToThrowConflict.image,
      })
      .expect(409)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Customer already exists',
          code: 'CustomerAlreadyExistsError',
          status: 409,
        });
      });
  });

  it('/v1/customers/:id Customer not found (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers/${uuid()}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Customer not found',
          code: 'CustomerNotFoundError',
          status: 404,
        });
      });
  });

  it('/v1/customers/:id Customer not found (PUT)', async () => {
    const { access_token } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer();

    return request(app.getHttpServer())
      .put(`/v1/customers/${uuid()}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: customer.surname,
        external_id: customer.external_id,
        image: customer.image,
      })
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Customer not found',
          code: 'CustomerNotFoundError',
          status: 404,
        });
      });
  });

  it('/v1/customers/:id Customer not found (DELETE)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .delete(`/v1/customers/${uuid()}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Customer not found',
          code: 'CustomerNotFoundError',
          status: 404,
        });
      });
  });

  it('/v1/customers/:id Id must be a uuid (GET)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .get(`/v1/customers/123`)
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

  it('/v1/customers/:id Id must be a uuid (PUT)', async () => {
    const { access_token } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer();

    return request(app.getHttpServer())
      .put(`/v1/customers/123`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: customer.surname,
        external_id: customer.external_id,
        image: customer.image,
      })
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

  it('/v1/customers/:id Id must be a uuid (DELETE)', async () => {
    const { access_token } = await utilService.getUserSigned();

    return request(app.getHttpServer())
      .delete(`/v1/customers/123`)
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

  it('/v1/customers Name must be a string (POST)', async () => {
    const { access_token } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer();

    return request(app.getHttpServer())
      .post(`/v1/customers`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: 1,
        surname: customer.surname,
        external_id: customer.external_id,
        image: customer.image,
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

  it('/v1/customers/:id Name must be a string (PUT)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .put(`/v1/customers/${uuid()}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: 1,
        surname: customer.surname,
        external_id: customer.external_id,
        image: customer.image,
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

  it('/v1/customers Surname must be a string (POST)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .post(`/v1/customers`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: 1,
        external_id: customer.external_id,
        image: customer.image,
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

  it('/v1/customers/:id Surname must be a string (PUT)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .put(`/v1/customers/${uuid()}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: 1,
        external_id: customer.external_id,
        image: customer.image,
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

  it('/v1/customers External id must be a string (POST)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .post(`/v1/customers`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: customer.surname,
        external_id: 1,
        image: customer.image,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'External id must be a string',
          code: 'ExternalIdMustBeAStringError',
          status: 400,
        });
      });
  });

  it('/v1/customers/:id External id must be a string (PUT)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .put(`/v1/customers/${uuid()}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: customer.surname,
        external_id: 1,
        image: customer.image,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'External id must be a string',
          code: 'ExternalIdMustBeAStringError',
          status: 400,
        });
      });
  });

  it('/v1/customers Image must be a string (POST)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .post(`/v1/customers`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: customer.surname,
        external_id: customer.external_id,
        image: 1,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Image must be a string',
          code: 'ImageMustBeAStringError',
          status: 400,
        });
      });
  });

  it('/v1/customers/:id Image must be a string (PUT)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .put(`/v1/customers/${uuid()}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: customer.surname,
        external_id: customer.external_id,
        image: 1,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'Image must be a string',
          code: 'ImageMustBeAStringError',
          status: 400,
        });
      });
  });

  it('/v1/customers Name should not be empty (POST)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .post(`/v1/customers`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: '',
        surname: customer.surname,
        external_id: customer.external_id,
        image: customer.image,
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

  it('/v1/customers/:id Name should not be empty (PUT)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .put(`/v1/customers/${uuid()}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: '',
        surname: customer.surname,
        external_id: customer.external_id,
        image: customer.image,
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

  it('/v1/customers Surname should not be empty (POST)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .post(`/v1/customers`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: '',
        external_id: customer.external_id,
        image: customer.image,
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

  it('/v1/customers/:id Surname should not be empty (PUT)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .put(`/v1/customers/${uuid()}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: '',
        external_id: customer.external_id,
        image: customer.image,
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

  it('/v1/customers External id should not be empty (POST)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .post(`/v1/customers`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: customer.surname,
        external_id: '',
        image: customer.image,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'External id should not be empty',
          code: 'ExternalIdShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/customers/:id External id should not be empty (PUT)', async () => {
    const { access_token, user } = await utilService.getUserSigned();
    const customer = await utilService.generateRandomCustomer(user);

    return request(app.getHttpServer())
      .put(`/v1/customers/${uuid()}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: customer.name,
        surname: customer.surname,
        external_id: '',
        image: customer.image,
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({
          success: false,
          error: 'External id should not be empty',
          code: 'ExternalIdShouldNotBeEmptyError',
          status: 400,
        });
      });
  });

  it('/v1/customers Not authenticated (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/v1/customers/${uuid()}`)
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

  it('/v1/customers Not authenticated (POST)', async () => {
    return request(app.getHttpServer())
      .post(`/v1/customers`)
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

  it('/v1/customers Not authenticated (PUT)', async () => {
    return request(app.getHttpServer())
      .put(`/v1/customers/${uuid()}`)
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

  it('/v1/customers Not authenticated (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`/v1/customers/${uuid()}`)
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
});
