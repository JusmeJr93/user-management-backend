import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

let connectionConfig;

if (process.env.JAWSDB_URL) {
    // Heroku environment
    connectionConfig = process.env.JAWSDB_URL;
} else {
    connectionConfig = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    };
}

export const pool = mysql.createPool(connectionConfig).promise();
