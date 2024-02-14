# Vilnius4Kids - Client

Server for application Vilnius4Kids.

## Environment Variables

To run this project, you will need to add the following environment variables.
To ease the process, a '.env.example' file is already provided, that you need to fill out and rename to '.env'.


`TOKEN_KEY`= your token key

`SMTP_HOST`= your SMTP host (default 'smtp.gmail.com')
`SMTP_PORT`= SMTP port (default 465)
`SMTP_SERVICE`= SMTP Service provide (default 'Gmail')
`SMTP_USERNAME`= your email username
`SMTP_PASSWORD`= your app password

`DB_USER`= your database user, (default 'postgres')
`DB_PASSWORD`= your database password, (default 'postgres')
`DB_NAME`= your database name (default 'vilnius4kidsdb')
`DB_SSL`= flag to enable SSL (default false)
`DB_HOST`= your database host (default 'localhost')
`DB_PORT`= your database port (default 5432)
`DB_TYPE`= your database type (default 'postgres')

`CLIENT_PATH`= the client base url, e.g. 'http://localhost:5173'

## Preparation

Make sure to create a database locally. By default, database name that the application tries to connect to is 'vilnius4kidsdb'.

## Run Locally

Go to the server root directory

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Run migrations

```bash
  npm migration:run
```

Start the server in development mode

```bash
  npm run dev
```


## Running Tests

To run all tests:

```bash
  npm run test
```
