# AuthMaster Backend

## Overview

This repository contains the backend service for **AuthMaster**, a full-stack user management system. It facilitates user registration, login, and comprehensive user management, such as blocking/unblocking, profile updates, and secure authentication. The backend is built using Node.js, powered by Express, with MySQL as the database, and secure user authentication through JWT (JSON Web Tokens).

For the frontend, Go to the [AuthMaster Frontend Repository](https://github.com/JusmeJr93/user-management-app).

## Key Features

- **User Registration**:
  - Register new users with email, password, and name.
  - Passwords are securely hashed in the database using **bcrypt**.
- **User Login**:
  - Users can authenticate using their email and password.
  - Successful login returns a JWT token for session management.
- **User Management**:
  - Get a list of all users.
  - Block/Unblock users (admin-only).
  - Delete users (admin-only).
  - Authenticated users can update their profile and admin can update all.

## Project Architecture

1. **Authentication:** JWT-based authentication ensures secure access to protected routes.
2. **Role-based Access Control:** Admins have special privileges such as blocking/unblocking and delete users.
3. **Database:** MySQL serves as the relational database to store user data securely.
4. **Data Validation:** Input validation is implemented to ensure that the submitted data is formatted correctly.

## Tech Stack

- **Node.js**: Used for server-side scripting.
- **Express.js**: Web framework for routing and handling HTTP requests.
- **MySQL2**: Database client for connecting to MySQL databases.
- **bcryptjs**: Library used to hash passwords and store credentials securely.
- **jsonwebtoken (JWT)**: For token-based authentication to secure API routes.
- **express-validator:** Middleware used to validate request credentials.
- **dotenv**: Library used to manage environment variables.
- **cors**: Used to enable cross-origin requests from the frontend.

## Deployment

The backend and database are deployed on Heroku.
