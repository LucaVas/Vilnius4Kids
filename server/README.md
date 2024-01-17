## Setup

1. `npm install`
2. Create a PostgreSQL database.
3. Add credentials to `.env` file based on `.env.example`.

For this project to work, you will need to finish writing entities and endpoints.

## API Reference

If you want to explore and test our API, feel free to use the panel interface. To run it, start the application:
```bash
npm run dev
```
Then, go to [panel's url](http://localhost:3000/panel).

## Running the server

In development mode:

```bash
# automatically migrates schema and restarts the server
npm run dev
```

In production mode:

```bash
# build
npm run build

# run the build
npm run start
```
