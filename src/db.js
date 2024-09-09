// Import the Client class from the 'pg' module to interact with PostgreSQL
const { Client } = require('pg');

// Import environment variables from the .env file using dotenv
require('dotenv').config();

// Create a new instance of the Client with configuration options
const client = new Client({
    user: process.env.DB_USER,        // The database user from the environment variables
    host: process.env.DB_HOST,        // The host where the database server is located
    database: process.env.DB_DATABASE, // The name of the database to connect to
    password: process.env.DB_PASSWORD, // The password for the database user
    port: process.env.DB_PORT,        // The port on which the database server is listening
});

// Connect to the PostgreSQL database
client.connect();

// Export the client instance to be used in other modules
module.exports = client;



