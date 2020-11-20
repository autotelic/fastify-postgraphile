# fastify-postgraphile

Fastify plugin for PostGraphile.

Takes inspiration from the following resources:
- [Using Postgraphile as a library](https://www.graphile.org/postgraphile/usage-library)
- [Postgraphile's Fastify v3 example](https://github.com/graphile/postgraphile/blob/v4/examples/servers/fastify3/rum-and-raisin.ts)

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
