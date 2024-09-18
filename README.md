# User Management Backend

## Overview

This project provides a backend service for **AuthMaster**, a full-stack user management system. It features user registration, login, and management functionalities including blocking/unblocking users, and updating user information. The service uses Express for the server, MySQL for the database, and JWT for authentication.

You can check the Frontend part [here](hhttps://github.com/JusmeJr93/user-management-app).

## Features

- **User Registration**: Register new users with email, password, and name.
- **User Login**: Authenticate users and generate JWT tokens.
- **User Management**:
  - Get a list of all users (protected route).
  - Block/Unblock users (protected route).
  - Delete users (protected route).
  - Edit user details (protected route).

## Tech Stack

- **Node.js**: JavaScript runtime for server-side scripting.
- **Express**: Web framework for building the server.
- **MySQL2**: Database client for connecting to MySQL databases.
- **bcryptjs**: Library for hashing passwords.
- **jsonwebtoken**: Library for generating and verifying JWT tokens.
- **dotenv**: Library for managing environment variables.
- **cors**: Middleware for handling Cross-Origin Resource Sharing.
