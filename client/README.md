# Vilnius4Kids - Client

Client for application Vilnius4Kids.

## Environment Variables

To run this project, you will need to add the following environment variables.
To ease the process, a '.env.example' file is already provided, that you need to fill out and rename to '.env'.

`VITE_API_ORIGIN`= your API origin url, for example "http://localhost:3000"
`VITE_API_PATH`= your API endpoint, for example "/api/v1/trpc"
`VITE_GOOGLE_MAPS_API_KEY`= your Google Maps API Key

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the client root directory

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

Start the server in development mode

```bash
  npm run dev
```


## Running Tests

To run all tests (make sure server is running):

```bash
  npm run test
```

To run unit tests:

```bash
  npm run test:unit
```

To run E2E tests (make sure server is running):

```bash
  npm run test:e2e
```

