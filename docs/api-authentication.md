# API Authentication (Laravel Sanctum)

This guide documents the API authentication system in **PC-NI-BOS**, powered by **Laravel Sanctum** (`laravel/sanctum` v4.x). It provides secure token-based authentication for external clients, mobile applications, and Single Page Application (SPA) frontends.

---

## 1. Overview & Mechanics

- **Token Type**: Bearer Personal Access Tokens (stored in `personal_access_tokens` table).
- **Header Convention**: `Authorization: Bearer <token>`
- **Payload & Content Types**: 
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Rate Limiting**:
  - `POST /api/register`: 10 requests / minute
  - `POST /api/login`: 6 requests / minute

---

## 2. Authentication Endpoints

| Method | Endpoint | Aliased Endpoint | Authentication | Rate Limit | Description |
|---|---|---|:---:|:---:|---|
| `POST` | `/api/register` | `/api/auth/register` | Public | 10 / min | Create customer account & issue initial bearer token |
| `POST` | `/api/login` | `/api/auth/login` | Public | 6 / min | Authenticate credentials & issue bearer token |
| `GET` | `/api/user` | — | `Bearer <token>` | — | Retrieve authenticated user profile |
| `POST` | `/api/logout` | `/api/auth/logout` | `Bearer <token>` | — | Revoke current personal access token |

---

## 3. Endpoint Specifications

### 3.1 Register Account (`POST /api/register`)

Registers a new user account with the default role of `'customer'`.

#### Request Headers
```http
Content-Type: application/json
Accept: application/json
```

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secretPassword123",
  "password_confirmation": "secretPassword123",
  "phone": "+6281234567890",
  "address": "123 Main Street, City"
}
```

| Field | Type | Required | Rules |
|---|---|:---:|---|
| `name` | string | Yes | max: 255 |
| `email` | string | Yes | email, max: 255, unique:users |
| `password` | string | Yes | min: 8, confirmed |
| `password_confirmation` | string | Yes | must match `password` |
| `phone` | string | No | max: 25 |
| `address` | string | No | max: 500 |

#### Success Response (`201 Created`)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "+6281234567890",
    "address": "123 Main Street, City",
    "email_verified_at": null,
    "created_at": "2026-10-12T12:00:00.000000Z",
    "updated_at": "2026-10-12T12:00:00.000000Z"
  },
  "token": "1|qWeRtYuIoP1234567890..."
}
```

---

### 3.2 Login (`POST /api/login`)

Authenticates email and password credentials and issues a new Sanctum token.

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "secretPassword123",
  "device_name": "mobile_android"
}
```

| Field | Type | Required | Description |
|---|---|:---:|---|
| `email` | string | Yes | Registered account email |
| `password` | string | Yes | Plaintext password |
| `device_name` | string | No | Label for token (defaults to `auth_token`) |

#### Success Response (`200 OK`)
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "+6281234567890",
    "address": "123 Main Street, City",
    "email_verified_at": null,
    "created_at": "2026-10-12T12:00:00.000000Z",
    "updated_at": "2026-10-12T12:00:00.000000Z"
  },
  "token": "2|aBcDeFgHiJ9876543210..."
}
```

#### Failure Response (`422 Unprocessable Entity`)
```json
{
  "message": "These credentials do not match our records.",
  "errors": {
    "email": [
      "These credentials do not match our records."
    ]
  }
}
```

---

### 3.3 Get Current User Profile (`GET /api/user`)

Returns the profile details of the authenticated bearer token owner.

#### Request Headers
```http
Authorization: Bearer <your_token_here>
Accept: application/json
```

#### Success Response (`200 OK`)
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "+6281234567890",
    "address": "123 Main Street, City",
    "email_verified_at": null,
    "created_at": "2026-10-12T12:00:00.000000Z",
    "updated_at": "2026-10-12T12:00:00.000000Z"
  }
}
```

#### Failure Response (`401 Unauthorized`)
```json
{
  "message": "Unauthenticated."
}
```

---

### 3.4 Logout (`POST /api/logout`)

Revokes the token currently in use by the client. Other tokens belonging to the user remain intact.

#### Request Headers
```http
Authorization: Bearer <your_token_here>
Accept: application/json
```

#### Success Response (`200 OK`)
```json
{
  "message": "Logged out successfully"
}
```

---

## 4. Testing Endpoints with cURL

### Register
```bash
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "0812345678",
    "address": "Baker Street No. 221B"
  }'
```

### Login
```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123",
    "device_name": "desktop_browser"
  }'
```

### Fetch Profile
```bash
curl -X GET http://127.0.0.1:8000/api/user \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Accept: application/json"
```

### Logout
```bash
curl -X POST http://127.0.0.1:8000/api/logout \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Accept: application/json"
```
