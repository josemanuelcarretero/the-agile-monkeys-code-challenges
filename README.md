# API Test - The CRM Service

## Description
Code challenge for The Agile Monkeys. The test consists of setting up a backend of small crm that serves a REST API.

## Table of Contents
- [Installation](#Installation)
- [Prerequisites](#Prerequisites)
- [Usage](#Usage)
- [Test](#Test)
- [Credicts](#Credits)
- [License](#License)

## Prerequisites
- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation 
### Using docker to launch postgres - development environment

1. Install the dependencies using the following command:

```bash
$ npm install
```

2. Copy template environment file to the root of the project.

```
$ cp .env.local.template .env
```

3. Change the `POSTGRES_USER` and `POSTGRES_PASSWORD` values in the `.env` file and update `dbusername` and `dbpassword` with the same values.
An example of the `.env` file is provided below.
```
# For postgres docker container. The database will be created with that values in the postgres server inside the container.
POSTGRES_USER=8288febf97e340c8891f5e44c929c73e
POSTGRES_PASSWORD=8288febf97e340c8891f5e44c929c73e
POSTGRES_DB=the_agile_monkeys_code_challenges_db
# For config of nodejs application
dbtype=postgres
dbhost=localhost
dbport=5432
dbusername=8288febf97e340c8891f5e44c929c73e
dbpassword=8288febf97e340c8891f5e44c929c73e
dbdatabase=the_agile_monkeys_code_challenges_db
# For user session
jwt_secret=9c2f7e6a3f5e4ac5b2e2c3ea8fc6e4a6e4da7b2b8a2a7e3b7c4e
jwt_expires_in=60d
# For offuscate the user email
app_domain=crm.josemanuelcarretero.me
# For download the images uploaded locally - only for development purposes
app_base_url=http://localhost:3000
app_prefix_images=/v1/image/
```
4. Run the following command to start the docker container with postgresql:
```
$ docker-compose up -f docker-compose.development.yml 
```
5. Run the following command to execute the migrations:
```
$ npm run typeorm:run
```

### Using a local or external postgresql database

1. Install the dependencies using the following command:

```bash
$ npm install
```

2. Copy template environment file to the root of the project.

```
$ cp .env.local.template .env
```

3. Change `dbusername`, `dbpassword`, `dbhost` and `dbdatabase` with the values of your local or external postgresql database.
   An example of the `.env` file is provided below.
```
# For config of nodejs application
dbtype=postgres
dbhost=localhost
dbport=5432
dbusername=8288febf97e340c8891f5e44c929c73e
dbpassword=8288febf97e340c8891f5e44c929c73e
dbdatabase=the_agile_monkeys_code_challenges_db
# For user session
jwt_secret=9c2f7e6a3f5e4ac5b2e2c3ea8fc6e4a6e4da7b2b8a2a7e3b7c4e
jwt_expires_in=60d
# For offuscate the user email
app_domain=crm.josemanuelcarretero.me
# For download the images uploaded locally - only for development purposes
app_base_url=http://localhost:3000
# For the e2e tests. The e2e tests need a database separated from main database. 
testing_dbtype=postgres
testing_dbhost=localhost
testing_dbport=5432
testing_dbusername=8288febf97e340c8891f5e44c929c73e
testing_dbpassword=8288febf97e340c8891f5e44c929c73e
testing_dbdatabase=testing
```

4. Run the following command to execute the migrations (The database must be created and empty before running the migration):
```
$ npm run typeorm:run
```

### Using a pipeline to launch the app - production environment (AWS)

1. Get a valid postgresql database. You can use any database connected to internet.
2. Configure an environment and an application in Elastic Beanstalk. The environment must have the following configuration:
- Docker implementation
- Environment variables loaded. In production the env file is not used.
3. Change the repository of dockerhub in buildspec.yml file to use your own dockerhub user.
4. Configure a CodePipeline canalization to launch the app. The pipeline must have the following configuration:
- Source code from git repository.
- Previous Elastic Beanstalk environment.
5. If all the steps are done, you can deploy the app in AWS when you upload the code to the repository.

## Usage

```bash
# development (launch docker container with postgresql)
$ npm run dev

# development (with postgresql server already running)
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
For testing it is required to have an auxiliary database different from the production database

```bash
# e2e tests
$ npm run test:e2e
```


## Credits

Author - API Test - [José Manuel Carretero](https://github.com/josemanuelcarretero)

Author - Nest - [Kamil Myśliwiec](https://kamilmysliwiec.com)

## License

API Test - The CRM Service is [MIT licensed](LICENSE.txt).

Nest is [MIT licensed](LICENSE.txt).
