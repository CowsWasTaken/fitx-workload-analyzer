
# FitX Workload Analyzer

A service to track the workload of a specific gym and get a data history for it.

## Frontend for data visualization

[![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)](https://fitx-workload-analyzer-ui.herokuapp.com/)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/CowsWasTaken/fitx-workload-analyzer-ui)

## API Reference

[![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)](https://fitx-workload-analyzer.herokuapp.com/api)
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```

BASE_URL=https://www.fitx.de/fitnessstudio/{id}/workload

PORT=8080

# For local database with docker compose
DATABASE_USER='user'
DATABASE_PASSWORD='password'
DATABASE_NAME='workload_db'
DATABASE_PORT=5432

DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/${DATABASE_NAME}?schema=public"

TIME_URL=https://worldtimeapi.org/api/timezone/Europe/Berlin

AUTH_TOKEN=


```
## Build the Service

To deploy this project run

## Installation

```bash
$ npm install
```


## Create Database (local)

```bash
$ docker compose up
```

## Migrate Database

```bash
$ npm prisma:migrate
```

## Running the app

```bash
# development
$ npm run start
```


## License

[MIT](https://choosealicense.com/licenses/mit/)

