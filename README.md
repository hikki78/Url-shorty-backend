<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description for this 

This is a simple nestJS application with different controllers functionalities (routes).

## Installation

```bash
$ npm install
```

## Running the docker for running the app 

```bash
# development
$ docker compose up -d --build

# watch mode
$ docker-compose up -d

```

## Run the app

Either run the app in postman calling the routes or do the following:

```bash
# For shortening URL
$ curl -X POST -H "Content-Type: application/json" -d '{"url":"<the link>"}' http://localhost:3000/shorten

# For retrieving the URL 
$ curl http://localhost:3000/<the hash of shortedned url >

# For seeing all the URL present in the account
$ curl http://localhost:3000/all

# For getting the analytics for the URL 
$ http://localhost:3000/analytics/<the hash of shortedned url >

# For deleting the URL 
$ curl -X DELETE http://localhost:3000/delete/<the hash of shortedned url >
```

Do the following steps and enjoy!!

(JWT Auth coild not be implemented for time constriants. Also no Jest implementation for test.)
