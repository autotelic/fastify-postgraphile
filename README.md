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
const postGraphile = require('@autotelic/fastify-postgraphile')
const { DATABASE_URL } = process.env

module.exports = function (fastify, options, next) {
    fastify.register(postGraphile, { database: DATABASE_URL })

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

### PostGraphile Options

| Option | Status | Type | Default | Description |
| ------- | :---: | :---: | :---: | --- |
| `database` | **Required** | String | - | A database connection string |
| `schemas` | Optional | String | 'public' | Description |
| `settings` | Optional | Object | - | An object containing PostGraphile settings to be combined with the default settings. **Defaults are not overwritten.** |
| `overrides` | Optional | Object | - | An object containing PostGraphile settings that will **overwrite default settings.** |

### Default Settings

The default options applied by `fastify-postgraphile` are the [recommended PostGraphile options](Recommended-Options).

These defaults can be added to or changed by passing additional PostGraphile Options in with either the `settings` object or the `overrides` object.

Options in the `settings` object will be deeply merged with the default options but the defaults will not be changed. 

Options in the `overrides` object will replace any corresponding default options. 

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

#### Run the server
```
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