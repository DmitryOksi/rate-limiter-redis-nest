## Installation

```bash
$ npm install
```

## Setting up the app

### create a copy of .env.example file, type command below:
```bash
$ sudo cp .env.example .env
```

### start redis container, type command below:
```bash
docker-compose -f redis.yml up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test API
### copy bearer token from .env.example for swagger doc
### use swagger doc to test endpoints [swagger docs](http://localhost:3000/api/#/).