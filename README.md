# COMP3123 — Assignment 1
## Employee Management REST API

**Student:** Mina Fahim  
**Student ID:** 101507439  
**Course:** COMP3123 — Full Stack Development I

## 1. Project

This project is a secure Employee Management REST API built with Node.js, Express.js, and MongoDB Atlas.

Users can register, log in, and perform employee CRUD operations. JWT authentication and ownership checks ensure users can only access their own employees.

**Technologies Used:** Node.js, Express.js, MongoDB Atlas, Mongoose, bcryptjs, JWT, Helmet, express-rate-limit, express-validator, dotenv, Morgan, and Postman.

**Project Structure:**

- `config/` — MongoDB connection
- `models/` — User and Employee models
- `controllers/` — API logic
- `routes/` — API endpoints
- `middleware/` — Authentication, authorization, validation, security, error handling, and logging
- `logs/` — Local application logs
- `index.js` — Application entry point

## 2. Installation

**1. Clone the repository:**

```bash
git clone https://github.com/mii1na/101507439_COMP3123_Assignment1.git
cd 101507439_COMP3123_Assignment1
```

**2. Install dependencies:**

```bash
npm install
```

**3. Configure environment variables:**

Create a `.env` file using `.env.example` as a template. Add your MongoDB Atlas connection string and JWT secret.

**4. Start MongoDB:**

This project uses MongoDB Atlas. Ensure the Atlas cluster is running, database user credentials and network access are configured, and the connection string points to the `comp3123_assignment1` database. No local MongoDB server is required.

**5. Start the application:**

```bash
node index.js
```

The API runs at `http://localhost:3000`.

**6. Test the API:**

Import the provided Postman collection. Test signup and login first, then use the returned JWT as a Bearer Token to test the protected employee endpoints.

## 3. Configuration

Required environment variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

- `PORT` — Application port
- `MONGODB_URI` — MongoDB Atlas database connection
- `JWT_SECRET` — Secret used to sign and verify JWT tokens

The actual `.env` file is excluded from GitHub using `.gitignore`. The `.env.example` file contains only placeholders.

## 4. API Endpoints

**User APIs**

| Method | Endpoint | Success |
|---|---|---|
| POST | `/api/v1/user/signup` | 201 |
| POST | `/api/v1/user/login` | 200 |

**Employee APIs**

| Method | Endpoint | Success |
|---|---|---|
| GET | `/api/v1/emp/employees` | 200 |
| POST | `/api/v1/emp/employees` | 201 |
| GET | `/api/v1/emp/employees/:eid` | 200 |
| PUT | `/api/v1/emp/employees/:eid` | 200 |
| DELETE | `/api/v1/emp/employees?eid=ID` | 204 |

All employee endpoints require authentication.

## 5. Authentication

**Signup:** Users register with a unique username, valid email, and password.

**Login:** Users can log in using their username or email and password.

**JWT:** Successful login generates a JWT valid for one hour.

Protected employee requests must include:

`Authorization: Bearer YOUR_JWT_TOKEN`

The authentication middleware verifies the JWT before allowing access to employee endpoints.

## 6. Authorization

Each employee has a `user` ObjectId field referencing the user who created it.

The application identifies the logged-in user through their verified JWT and checks employee ownership in the controller and database queries.

Users can only view, update, or delete employees they own. Attempts to access another user's employee are rejected with `403 Forbidden`.

## 7. Security

- **Password Hashing:** bcryptjs hashes passwords before storage.
- **JWT:** Protects employee endpoints and expires after one hour.
- **Helmet:** Adds HTTP security headers.
- **Rate Limiting:** Limits signup and login to 10 requests per IP address within 15 minutes. Exceeding the limit returns `429 Too Many Requests`.
- **Input Validation:** Checks required fields, email formats, password length, salary, dates, employee IDs, and unexpected fields.
- **Environment Variables:** Protect database credentials and JWT secrets.
- **Error Handling:** Returns appropriate HTTP status codes and JSON error messages.

## 8. Logging

Application logs are stored locally in:

- `logs/app.log` — API requests, timestamps, HTTP methods, request paths, response status codes, authentication events, successful operations, and warnings.
- `logs/error.log` — Unexpected application errors.

Sensitive information such as passwords, full JWT tokens, and database credentials is intentionally excluded from logs.

## 9. Health Check

**Local URL:** `GET http://localhost:3000/health`

**Deployed URL:** `GET https://101507439-comp-3123-assignment1-4fk.vercel.app/health`

**Expected Status:** `200 OK`

**Expected Response:**

```json
{
  "status": "success",
  "message": "API is running"
}
```

## 10. Sample Credentials for Marking

The following disposable test account is available in the development database:

**Username:** `minafahim20`  
**Email:** `fahim123@example.com`  
**Password:** `TestPass123!`

**Login Endpoint:** `POST /api/v1/user/login`

If using a fresh database, create the sample account through the signup endpoint before logging in.

## 11. Testing

The API was tested using Postman, covering signup, login, employee CRUD, JWT authentication, input validation, rate limiting, error handling, and two-user ownership protection.

The exported Postman collection and screenshots are included with the assignment submission.