# Example of RESTful API with Fastify and Prisma ORM

## Requirements

- Node.js >=16.17.0
- NPM >=8.15.0
- MySQL


## Deployment

1. Clone the application from the repository.

2. Install dependencies:

        npm ci

3. Create the .env file by copying the .env.example file:

        cp .env.example .env

4. Specify the port, JWT key and database URL in the .env file.

5. Create database:

		sudo mysql -uuser -ppass
		> CREATE DATABASE `fastify-articles-app` CHARACTER SET utf8 COLLATE utf8_general_ci;
		> exit

	Replace user and pass with your username and password, respectively.

6. Run migrations and seeds:

    	npm run migrate
    	npm run db:seed

The next steps will be different for development and production modes.

### Development mode

1. Install nodemon globally:

	    sudo npm i -g nodemon

2. Launch the application:

	    npm run start:dev

### Production mode

1. Install pm2 globally:

	    sudo npm i -g pm2

2. Launch the application:

	    npm run start:prod


## Testing

1. Create the .env.test file by copying the .env.example file:

        cp .env.example .env.test

2. Specify the port, JWT key and database URL in the .env.test file.

3. Create database:

		sudo mysql -uuser -ppass
		> CREATE DATABASE `fastify-articles-app_test` CHARACTER SET utf8 COLLATE utf8_general_ci;
		> exit

	Replace user and pass with your username and password, respectively.

4. Run tests:

	    npm run test
