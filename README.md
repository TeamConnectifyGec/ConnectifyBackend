To install all the dependencies in package.json

npm install

To start the server run in devlopment mode

npm run dev

To start the server in release mode

npm run app


 Base URL

http://localhost:3000/api/

For autentication 

Base URL

http://localhost:3000/api/auth


 Endpoints

 1. User Signup

- URL: `/signup`
- Method: `POST`
- Description: Creates a new user account.
- Request Headers:
  - `Content-Type: application/json`
- Request Body:
  json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  
- Response:
  - Success (201 - Created):
    json
    {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    
    - *Description*: User registered successfully, JWT token provided for authentication.
  - Error (400 - Bad Request):
    json
    {
      "message": "Error message"
    }
    
    - *Description*: Registration failed due to invalid or incomplete request data.



 2. User Login

- URL: `/login`
- Method: `POST`
- Description: Authenticates an existing user and returns a JWT token.
- Request Headers:
  - `Content-Type: application/json`
- Request Body:
  json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  
- Response:
  - Success (200 - OK):
    json
    {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    
    - *Description*: User authenticated successfully, JWT token returned.
  - Error (401 - Unauthorized):
    json
    {
      "message": "Invalid email or password"
    }
    
    - *Description*: Authentication failed due to incorrect credentials.
  - Error (400 - Bad Request):
    json
    {
      "message": "Error message"
    }
    
    - *Description*: Invalid request data, such as a missing email or password field.



 Sample Requests and Responses

 Signup Example

 Request:
http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}


 Response (201 - Created):
json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}




 Login Example

 Request:
http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}


 Response (200 - OK):
json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}




 Error Codes

| Status Code | Description                               |
|-|-|
| 201     | User created successfully                 |
| 200     | User authenticated successfully           |
| 400     | Bad request (e.g., missing/invalid data)  |
| 401     | Unauthorized (invalid credentials)        |



 Authentication Workflow

1. Signup: Clients should use the `/signup` route to create a new user account.
   - After successful signup, the server responds with a JWT token. This token must be saved and used for further authenticated requests.
  
2. Login: Existing users should authenticate using the `/login` route.
   - A successful login also returns a JWT token that can be used to access protected endpoints.



 Security Considerations

- JWT Tokens: Tokens should be sent in the `Authorization` header of requests to protected routes.
  - Example: `Authorization: Bearer <token>`
  
- Password Hashing: User passwords are securely hashed before being stored in the database using `bcryptjs`.

- Environment Variables: Ensure sensitive data such as `JWT_SECRET` and `MONGO_URI` are stored in environment variables.



