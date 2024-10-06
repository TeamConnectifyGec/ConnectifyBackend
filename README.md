**To install all the dependencies in package.json**
- `npm install`

**To start the server run in devlopment mode**
- `npm run dev`

**To start the server in deployment mode**
- `npm run app`

### API Documentation

**Base URL:** `https://server-url.app/api/`

---

### Directly implemented apis

---

### 1. API Route: `/auth/signup`
- **Method**: `POST`
- **Purpose**: Register a new user by signing up. If the username or email already exists, an error message will be returned. If registration is successful, a verification email will be sent.
- **Request Body**:
  - `username`: String (required)
  - `email`: String (required)
  - `password`: String (required)
  
- **Response**:
  - **200**: `Verification email sent to {email}`
  - **409**: `Username already taken`
  - **409**: `Email already registered`
  - **201**: 
    ```json
    {
      "userid": "user_id",
      "username": "username",
      "email": "email",
      "token": "JWT_token",
      "message": "User registered"
    }
    ```
  - **500**: `An unexpected error occurred` or specific error message

---

### 2. API Route: `/auth/login`
- **Method**: `POST`
- **Purpose**: Log in an existing user by checking username and password. If valid, return user details and a JWT token.
- **Request Body**:
  - `username`: String (required)
  - `password`: String (required)
  
- **Response**:
  - **200**: 
    ```json
    {
      "userid": "user_id",
      "username": "username",
      "email": "email",
      "token": "JWT_token"
    }
    ```
  - **401**: `Invalid email or password`
  - **500**: Specific error message

---

### 3. API Route: `/password/forgot-password`
- **Method**: `GET`
- **Purpose**: Request a password reset by submitting the user's email. If the email exists, a verification email is sent with a reset token.
- **Request Body**:
  - `email`: String (required)

- **Response**:
  - **200**: `Verification email sent to {email}`
  - **404**: `Email not found`
  - **500**: Specific error message

---

### Indeirectly implemented apis

---

### 1. API Route: `/auth/email-verify`
- **Method**: `GET`
- **Purpose**: Verify the user's email using the token provided via the query parameter. 
               (must be used outside of the app. onyl for email verification)
- **Request Query Parameters**:
  - `token`: String (required)

- **Response**:
  - **200**: On successful verification, an HTML file is sent to confirm email verification.
  - **400**: On invalid or expired token, an HTML file is sent indicating email verification failure.

---

### 2. API Route: `/password/reset-password`
- **Method**: `GET`
- **Purpose**: Display the reset password form when a valid token is provided.
- **Request Query Parameters**:
  - `token`: String (required)

- **Response**:
  - **200**: HTML form for password reset is displayed if the token is valid.
  - **400**: `Token is required`
  - **400**: `Invalid token or token expired`
  - **400**: `Token verification error`
  - **400**: `Token has expired`

---

### 3. API Route: `/password/reset-password`
- **Method**: `POST`
- **Purpose**: Reset the user's password using the provided token and new password.
- **Request Body**:
  - `token`: String (required)
  - `password`: String (required)

- **Response**:
  - **200**: `Password has been reset successfully`
  - **400**: `Token and new password are required`
  - **401**: `Token has expired`
  - **401**: `Invalid token`
  - **404**: `User not found`
  - **500**: `An error occurred while resetting the password`

