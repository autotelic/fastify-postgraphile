# fastify-postgraphile

Fastify plugin for PostGraphile.

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
