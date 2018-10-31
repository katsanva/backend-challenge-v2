# Backend Challenge v2 - Phone App

## TL;DR

```sh
docker-compose up -d

curl -X GET \
  http://localhost:3000/api/phones \
  -H 'content-type: application/json'
```

## General notes

The task was not really clear, so the next assumptions were made:

- phone image is a link
- list of phones passed is a list of ids
- all passed phone ids are unique
- any transport between services can be used
- any storage can be used

The app is based on microservice approach and follows next patterns:

- [Service instance per container](https://microservices.io/patterns/deployment/service-per-container.html)
- [Database per service](https://microservices.io/patterns/data/database-per-service.html)
- [Service registry](https://microservices.io/patterns/service-registry.html)
- [API Gateway](https://microservices.io/patterns/apigateway.html)
- [Messaging](https://microservices.io/patterns/communication-style/messaging.html)
- [12 factor apps](https://12factor.net)(or at least tries to follow that)

## Stack

- [Node.js](https://nodejs.org/en/) - a javascript runtime (v10.12)
- [TypeScript](https://www.typescriptlang.org) - add some types to plain javascript (v3.1)
- [Moleculer](https://moleculer.services) - a modern Node.js framework for building microservices (v0.13)
- [Docker](https://www.docker.com) - containerization platform (v18.06.1-ce)
- [MongoDB](https://www.mongodb.com) - document-oriented database (v4.0)
- [RabbitMQ](https://www.rabbitmq.com) - messaging, that just works (v3.7)


## API

### Notes

- The application will listen on port 3000 by default.
- All endpoints will return (and accept, if possible) `application/json`.
- There is pretty straightforward validation on all `POST` routes.

### API Doc

#### `GET /api/phones` - to obtain list of phones.

Documentation about query params for pagination is [here](https://github.com/moleculerjs/moleculer-db/tree/master/packages/moleculer-db#parameters);

Response example:

```json
{
    "rows": [
        {
            "_id": "5bd6c82f8452791a13ef5f0f",
            "image": "http://some.good/link",
            "name": "'name'",
            "description": "description",
            "price": "42.00"
        }
    ],
    "total": 2,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
}
```

#### `POST /api/orders` - to create an order

Request example:

```json
{
	"customer": {
		"name": "Name",
		"surname": "Surname",
		"email": "foo@bla.com"
	},
	"phones": ["54759eb3c090d83494e2d804"]
}
```

Response example (failed validation):
```json
{
    "name": "ValidationError",
    "message": "Some of phones are incorrect",
    "code": 422,
    "type": "field",
    "data": [
        {
            "type": "not_exist",
            "message": "Provided phones do not exist",
            "values": [
                "54759eb3c090d83494e2d804"
            ]
        }
    ]
}
```

Response example (success):
```json
{
    "phones": [
        "5bd6c82f8452791a13ef5f0f"
    ],
    "_id": "5bd6c99b1a30541c8d1ee0e8",
    "customer": {
        "name": "Name",
        "surname": "Surname",
        "email": "foo@bla.com"
    },
    "total": "42.00"
}
```

#### `POST /api/phones` - to create a phone record

Request example: 
 ```json
{
	"image": "http://some.good/link",
	"name": "'name'",
	"description": "description",
	"price": "42.00"
}
```

Response example:
```json
{
    "_id": "5bd6c82f8452791a13ef5f0f",
    "image": "http://some.good/link",
    "name": "'name'",
    "description": "description",
    "price": "42.00"
}
```

## Development

## Requirements

- [Node.js](https://nodejs.org/en/)  (v10.12)
- [npm](https://docs.npmjs.com/getting-started/what-is-npm) (6.4.1)
- [Docker](https://www.docker.com) with docker-compose (v18.06.1-ce)

> _NOTE_: For application been able to start you need to have `rabbitmq` and `mongo` up and running. The basic way to achieve that is run `docker-compose up mongo rabbitmq -d` *before* starting the application.

### Start

```sh
npm start
```

### Watch

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Testing

#### Unit tests

```sh
npm run test:unit
```

#### Integration tests

> _NOTE_: While running integration tests you need to have `rabbitmq` and `mongo` up and running. The basic startup implemented in `pretest:integration` task, but in some cases rabbitmq can take too long to start, so it will fail. To avoid that please run `docker-compose up mongo rabbitmq -d` *before* running the integration tests or simple re-run tests.

```sh
npm run test:integration
```

#### All tests

```sh
npm test
```

## Q&A

### How would you avoid your order api to be overflow?

- add caching on application level
- add some load balancing
- scale application
- implement some request limits

### How would you improve the system?

- implement all from the above
- add some user management
- add more tests to cover some edge-cases
- describe types more precisely
- run gateway as https
