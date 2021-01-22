# fastify-postgraphile

Fastify plugin for PostGraphile.

Takes inspiration from the following resources:
- [Using Postgraphile as a library](https://www.graphile.org/postgraphile/usage-library)
- [Postgraphile's Fastify v3 example](https://github.com/graphile/postgraphile/blob/v4/examples/servers/fastify3/rum-and-raisin.ts)

## Usage

```sh
npm install @autotelic/fastify-postgraphile
```

```js
const fastifyPostGraphile = require('@autotelic/fastify-postgraphile')
const { DATABASE_URL } = process.env

module.exports = function (fastify, options, next) {
    fastify.register(fastifyPostGraphile, { database: DATABASE_URL })

    fastify.get('/', (req, reply) => {
      reply.type('application/json')
      reply.send({ foo: 'bar' })
    })

    fastify.post('/', (req, reply) => {
      reply.type('application/json')
      reply.send({ hello: 'world' })
    })

    next()
}
```

### API: fastifyPostGraphile(database, schemas, settings)

| Name | Status | Type | Default | Description |
| ------- | :---: | :---: | :---: | --- |
| `database` | **Required** | String/Object | - | An object or string that will be passed to the pg library and used to connect to a PostgreSQL backend, OR a pg.Pool to use. |
| `schemas` | Optional | String/[String] | 'public' | A string, or array of strings, which specifies the PostgreSQL schema(s) to expose via PostGraphile; defaults to 'public' |
| `settings` | Optional | Object | - | An object containing [PostGraphile options](options-reference) to be combined with the [default recommended options](Recommended-Options). |

### Default Options

The default options applied by `fastify-postgraphile` are the [recommended PostGraphile options](Recommended-Options).

These defaults can be added to or changed by passing additional PostGraphile Options in with the `settings` object. The `extendedErrors` and `appendPlugins` arrays will be concatenated with any new options passed in.

Note: If you need to disable the default [`simplifyInflector` plugin](pg-simplify-inflector), pass the exported reference to it into the `skipPlugins` option array. 

e.g.
```js
skipPlugins: [fastifyPostGraphile.DEFAULT_INFLECTOR]
```

## Run the example

#### Configure and run a local Postgres Container
```
docker run --name postgraphile-example \
  -e POSTGRES_PASSWORD=examplepassword \
  -d -p 5432:5432 postgres
```
```
ifconfig -u | grep 'inet ' | grep -v 127.0.0.1 | cut -d\  -f2 | head -1
# <your-public-ip> <-- Copy this
```
#### Add the following to your `.envrc` file:
`export DATABASE_URL=postgres://postgres:examplepassword@<your-public-ip>:5432/postgres?sslmode=disable`

Allow .envrc file
```sh
direnv allow .
```
### Run the example migration
```sh
npx -p pg -p node-pg-migrate -c "node-pg-migrate up -m examples/migrations"
```

#### Run the server
```sh
npm run example -- -l info -w
```

#### Make Requests to the Server
```
http localhost:3000
http post localhost:3000
```

#### Explore Graphiql

[localhost:3000/graphiql](localhost:3000/graphiql)

[Recommended-Options][https://www.graphile.org/postgraphile/usage-library/#recommended-options]
[options-reference][https://www.graphile.org/postgraphile/usage-library/#api-postgraphilepgconfig-schemaname-options]
[pg-simplify-inflector][https://www.npmjs.com/package/@graphile-contrib/pg-simplify-inflector]