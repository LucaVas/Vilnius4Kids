# Vilnius4Kids - Client

Server for application Vilnius4Kids.

## Environment Variables

To run the server, you will need to add environment variables to your .env file.
To ease the process, a '.env.example' file is already provided, that you need to fill out and rename to '.env'.

## Preparation

Make sure to create a database locally. By default, database name that the application tries to connect to is 'vilnius4kidsdb'.

## Run Locally

Go to the root directory and run the following command to install dependencies (if you have not already done it while spinning up the client) and run migrations:

```bash
  npm ci && npm migration:run -w=server
```

Start the server in development mode

```bash
  npm run dev -w=server
```

Server will be running at http://localhost:3000/.


## Running Tests

To run all server unit tests:

```bash
  npm run test -w=server
```
