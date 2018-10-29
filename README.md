# Backend Challenge v2 - Phone App

## TL;DR

```sh
docker-compose up -d

curl -X GET \
  http://localhost:3000/api/phones \
  -H 'content-type: application/json'
```

## Application

### General notes

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

### Stack

- [Node.js](https://nodejs.org/en/) - a javascript runtime (v10.12)
- [TypeScript](https://www.typescriptlang.org) - add some types to plain javascript (v3.1)
- [Moleculer](https://moleculer.services) - a modern Node.js framework for building microservices (v0.13)
- [Docker](https://www.docker.com) - containerization platform (v18.06.1-ce)
- [MongoDB](https://www.mongodb.com) - document-oriented database (v4.0)
- [RabbitMQ](https://www.rabbitmq.com) - messaging, that just works (v3.7)


### API

The application will listen on port 3000 by default.

All endpoints will return (and accept, if possible) `application/json`.

There are validation on all `POST` routes.

There are next endpoints exposed:

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
