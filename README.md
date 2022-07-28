
# FitX Workload Analyzer

A service to track the workload of a specific gym and get a data history for it.


## API Reference

#### Get Current Workload

```http request
  GET /
```
Returns the current workload and saves it in the database

```json
    {"percentage":42,"timestamp":1659032469}
```

#### Get History

```http request
  GET /history
```
Returns the history as a list of `Workload` records

```json
[
    {"percentage":42,"timestamp":1659032146},
    {"percentage":42,"timestamp":1659032414},
    {"percentage":42,"timestamp":1659032428},
    {"percentage":42,"timestamp":1659032468},
    {"percentage":42,"timestamp":1659032469}
]
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```

WORKLOAD_URL=https://www.fitx.de/fitnessstudio/76/workload
PORT=8080

# For local database with docker compose
DATABASE_USER='user'
DATABASE_PASSWORD='password'
DATABASE_NAME='workload_db'
DATABASE_PORT=5432

DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/${DATABASE_NAME}?schema=public"

TIME_URL=https://worldtimeapi.org/api/timezone/Europe/Berlin

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

