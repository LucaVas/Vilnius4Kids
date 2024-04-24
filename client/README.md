# Vilnius4Kids - Client

Client for application Vilnius4Kids.

## Environment Variables

To run the client, you will need to add environment variables to your .env file.
To ease the process, a '.env.example' file is already provided, that you need to fill out and rename to '.env'.

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the root directory and install dependencies (if you have not already done it while spinning up the server):

```bash
  npm ci
```

Start the server in development mode

```bash
  npm run dev -w=client
```

The client will run on http://localhost:5173.

## Running Tests

To run all tests (make sure server is running):

```bash
  npm run test -w=client
```

To run unit tests:

```bash
  npm run test:unit -w=client
```

To run E2E tests (make sure server is running):

```bash
  npm run test:e2e -w=client
```

