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


### **User Profile API**

#### 1. **Update User Profile**
- **Endpoint:** `PUT /profile`
- **Description:** Updates the user profile, including name, bio, and profile picture.
- **Authorization:** Requires authentication.
- **Request Body:**
  - `name` (optional) - New name of the user.
  - `bio` (optional) - New bio of the user.
  - `file` (optional) - Profile picture file (image).
- **Success Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "_id": "userId",
      "username": "username",
      "email": "user@example.com",
      "name": "New Name",
      "bio": "New Bio",
      "pfp_link": "cloudinary_url_of_the_image",
      "created_on": "timestamp",
      "updated_at": "timestamp"
    }
    ```
- **Error Responses:**
  - **Status Code:** `404 Not Found` (if the user is not found).
  - **Status Code:** `500 Internal Server Error` (server error).

#### 2. **Get User Profile**
- **Endpoint:** `GET /profile`
- **Description:** Fetches the authenticated user's profile information.
- **Authorization:** Requires authentication.
- **Response:**
  - **Status Code:** `200 OK`
  - **Body:**
    ```json
    {
      "_id": "userId",
      "username": "username",
      "email": "user@example.com",
      "name": "User Name",
      "bio": "User Bio",
      "pfp_link": "cloudinary_url_of_the_image",
      "created_on": "timestamp"
    }
    ```
- **Error Responses:**
  - **Status Code:** `404 Not Found` (if the user is not found).
  - **Status Code:** `500 Internal Server Error` (server error).

---

### **User Post API**

#### 1. **Create Post**
- **Endpoint:** `POST /create-post`
- **Description:** Allows an authenticated user to create a post.
- **Authorization:** Requires authentication.
- **Request Body:**
  - `post_title` (required) - The title of the post.
  - `visibility` (optional) - Set to `public` or `private` (default is `public`).
  - `community_id` (optional) - Reference to the community where the post was made.
  - `post_hashes` (optional) - Array of tags/hashes to associate with the post.
  - `file` (optional) - Image file for the post.
- **Success Response:**
  - **Status Code:** `201 Created`
  - **Body:**
    ```json
    {
      "_id": "postId",
      "user_id": "userId",
      "post_title": "Title",
      "visibility": "public",
      "community_id": "communityId",
      "post_image_link": "cloudinary_url_of_the_image",
      "post_hashes": ["tag1", "tag2"],
      "created_at": "timestamp"
    }
    ```
- **Error Responses:**
  - **Status Code:** `400 Bad Request` (if required fields are missing).
  - **Status Code:** `500 Internal Server Error` (server error).

---

### **2. Get All User Posts**
Fetch all posts created by the logged-in user.

- **URL**: `/api/user/posts`
- **Method**: GET
- **Headers**: 
  - `Authorization: Bearer <token>` (JWT token for authentication)
- **Response**:
  - **200 OK**: Returns a list of the user's posts.
    ```json
    {
      "posts": [
        {
          "_id": "post_id",
          "user_id": "user_id",
          "post_title": "Post title",
          "post_points": 10,
          "visibility": "public",
          "created_at": "2024-10-10T10:00:00.000Z",
          ...
        }
      ]
    }
    ```
  - **404 Not Found**: No posts found for the user.
    ```json
    {
      "message": "No posts found for this user"
    }
    ```
  - **500 Internal Server Error**: If an error occurs.
    ```json
    {
      "message": "Internal server error"
    }
    ```

---

### **User Comment API**

#### 1. **Create Comment**
- **Endpoint:** `POST /create-comment`
- **Description:** Allows an authenticated user to add a comment to a post.
- **Authorization:** Requires authentication.
- **Request Body:**
  - `post_id` (required) - The ID of the post to comment on.
  - `comment_text` (required) - The content of the comment.
- **Success Response:**
  - **Status Code:** `201 Created`
  - **Body:**
    ```json
    {
      "message": "Comment added successfully",
      "comment": {
        "_id": "commentId",
        "user_id": "userId",
        "post_id": "postId",
        "comment_text": "This is a comment",
        "created_at": "timestamp"
      }
    }
    ```
- **Error Responses:**
  - **Status Code:** `404 Not Found` (if the post is not found).
  - **Status Code:** `500 Internal Server Error` (server error).

---

### **2. Get All User Comments**
Fetch all comments made by the logged-in user.

- **URL**: `/api/user/comments`
- **Method**: GET
- **Headers**: 
  - `Authorization: Bearer <token>` (JWT token for authentication)
- **Response**:
  - **200 OK**: Returns a list of the user's comments.
    ```json
    {
      "comments": [
        {
          "_id": "comment_id",
          "user_id": "user_id",
          "post_id": "post_id",
          "comment_text": "This is a comment",
          "created_at": "2024-10-10T11:00:00.000Z",
          ...
        }
      ]
    }
    ```
  - **404 Not Found**: No comments found for the user.
    ```json
    {
      "message": "No comments found for this user"
    }
    ```
  - **500 Internal Server Error**: If an error occurs.
    ```json
    {
      "message": "Internal server error"
    }
    ```

---

### **User connections API**


### **1. Add Connection**
Create a connection request between two users.

- **URL**: `/api/connections/add`
- **Method**: POST
- **Headers**: 
  - `Authorization: Bearer <token>` (JWT token for authentication)
- **Body**:
  ```json
  {
    "user1": "user_id_1",
    "user2": "user_id_2"
  }
  ```
- **Response**:
  - **201 Created**: Connection request created.
    ```json
    {
      "message": "Connection request sent",
      "connection": {
        "user1": "user_id_1",
        "user2": "user_id_2",
        "status": "pending",
        "created_at": "2024-10-10T12:00:00.000Z"
      }
    }
    ```
  - **400 Bad Request**: Missing required fields.
    ```json
    {
      "message": "Both user1 and user2 are required"
    }
    ```
  - **404 Not Found**: One or both users not found.
    ```json
    {
      "message": "One or both users not found"
    }
    ```
  - **409 Conflict**: Connection already exists.
    ```json
    {
      "message": "Connection already exists"
    }
    ```
  - **500 Internal Server Error**: If an error occurs.
    ```json
    {
      "message": "Internal server error"
    }
    ```

---

### **2. Get User Connections**
Fetch all accepted connections for the logged-in user.

- **URL**: `/api/connections/all`
- **Method**: GET
- **Headers**: 
  - `Authorization: Bearer <token>` (JWT token for authentication)
- **Response**:
  - **200 OK**: Returns a list of the user's accepted connections.
    ```json
    {
      "connections": [
        {
          "_id": "connection_id",
          "user1": {
            "_id": "user1_id",
            "name": "User One",
            "email": "user1@example.com"
          },
          "user2": {
            "_id": "user2_id",
            "name": "User Two",
            "email": "user2@example.com"
          },
          "status": "accepted",
          "created_at": "2024-10-10T12:00:00.000Z"
        }
      ]
    }
    ```
  - **404 Not Found**: User not found.
    ```json
    {
      "message": "User not found"
    }
    ```
  - **500 Internal Server Error**: If an error occurs.
    ```json
    {
      "message": "Internal server error"
    }
    ```

---

### **3. Get Connection Count**
Fetch the total number of accepted connections for the logged-in user.

- **URL**: `/api/connections/count`
- **Method**: GET
- **Headers**: 
  - `Authorization: Bearer <token>` (JWT token for authentication)
- **Response**:
  - **200 OK**: Returns the count of the user's accepted connections.
    ```json
    {
      "connectionCount": 10
    }
    ```
  - **404 Not Found**: User not found.
    ```json
    {
      "message": "User not found"
    }
    ```
  - **500 Internal Server Error**: If an error occurs.
    ```json
    {
      "message": "Internal server error"
    }
    ```

---


### Authentication
- All endpoints require authentication via JWT token passed in the `Authorization` header.


### Error Handling
- **500 Internal Server Error**: Indicates a problem on the server.

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

