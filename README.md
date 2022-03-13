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

1. Install the dependencies using the following command:

```bash
$ npm install
```

2. Copy template environment file to the root of the project.

```
cp .env.local.template .env
```

3. 
- (A) Change the `POSTGRES_USER` and `POSTGRES_PASSWORD` values in the `.env` file and update `dbusername` and `dbpassword` with the same values. 
- (B) If you don't want to use the docker container with postgresql and have own postgres server already running, change the `dbhost`, `dbusername` and `dbpassword` values with corresponding values in the `.env` file. The database must be empty.

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
```

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

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Credits

Author - API Test - [José Manuel Carretero](https://github.com/josemanuelcarretero)

Author - Nest - [Kamil Myśliwiec](https://kamilmysliwiec.com)

## License

API Test - The CRM Service is [MIT licensed](LICENSE.txt).
Nest is [MIT licensed](LICENSE).
