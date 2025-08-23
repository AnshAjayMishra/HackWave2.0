# Landing Page with User Authentication

This is a Next.js landing page application with a complete user authentication flow. New users are redirected to a registration page to fill in their basic details, while existing users are directly redirected to the dashboard.

## Features

- **Landing Page**: Beautiful landing page with hero section, features, pricing, and testimonials
- **User Registration**: New users fill in basic details (name, email, mobile, city, address, gender)
- **User Authentication**: Existing users can login with email/password
- **Dashboard**: Protected dashboard page for authenticated users
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **Authentication Middleware**: Automatic routing based on user authentication status

## Authentication Flow

1. **New Users**: Visit the site → Redirected to `/register` → Fill form → Redirected to `/dash`
2. **Existing Users**: Visit the site → Automatically redirected to `/dash` (if authenticated)
3. **Unauthenticated Users**: Trying to access `/dash` → Redirected to `/register`

## File Structure

```
landing/
├── app/
│   ├── api/auth/           # Backend API endpoints
│   │   ├── login/          # User login
│   │   ├── register/       # User registration
│   │   ├── me/            # Get current user
│   │   └── logout/        # User logout
│   ├── dash/              # Dashboard page (protected)
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── layout.tsx         # Root layout with UserProvider
├── components/            # Reusable UI components
├── contexts/             # React context for user state
│   └── user-context.tsx  # User authentication context
├── middleware.ts         # Authentication routing middleware
└── README.md            # This file
```

## Backend API Implementation

The frontend is ready to work with your backend APIs. Here are the endpoints you need to implement:

### 1. User Registration - `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "city": "New York",
  "address": "123 Main St, New York, NY 10001",
  "gender": "male"
}
```

**Response:**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "city": "New York",
  "address": "123 Main St, New York, NY 10001",
  "gender": "male",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Implementation Steps:**
1. Validate input data
2. Check if user already exists (by email)
3. Hash password if you're adding one
4. Save user to database
5. Generate JWT or session token
6. Set `auth-token` cookie with the token

### 2. User Login - `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as registration response

**Implementation Steps:**
1. Validate input data
2. Check if user exists
3. Verify password
4. Generate new token
5. Set `auth-token` cookie

### 3. Get Current User - `GET /api/auth/me`

**Headers:** Cookie with `auth-token`

**Response:** Same as registration response

**Implementation Steps:**
1. Extract token from cookies
2. Verify token validity
3. Get user data from database
4. Return user data

### 4. User Logout - `POST /api/auth/logout`

**Headers:** Cookie with `auth-token`

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Implementation Steps:**
1. Extract token from cookies
2. Invalidate token (optional)
3. Clear `auth-token` cookie

## Database Schema

Here's a suggested database schema for the user table:

```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- Optional if you want password authentication
  mobile VARCHAR(20),
  city VARCHAR(100),
  address TEXT,
  gender ENUM('male', 'female', 'other', 'prefer-not-to-say'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

## Environment Variables

Create a `.env.local` file with your database and JWT configuration:

```env
# Database
DATABASE_URL="your_database_connection_string"

# JWT Secret
JWT_SECRET="your_jwt_secret_key"

# Cookie Settings
COOKIE_SECRET="your_cookie_secret"
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Implement backend APIs:**
   - Replace the placeholder API routes in `app/api/auth/` with your actual implementation
   - Connect to your database
   - Implement proper authentication (JWT, sessions, etc.)

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Security Considerations

- Use HTTPS in production
- Implement proper password hashing (bcrypt, Argon2)
- Use secure, httpOnly cookies
- Implement rate limiting
- Add input validation and sanitization
- Use environment variables for sensitive data
- Implement proper error handling

## Customization

- **Styling**: Modify Tailwind classes in components
- **Fields**: Add/remove fields from the registration form
- **Validation**: Add client-side and server-side validation
- **Authentication**: Switch between JWT, sessions, or other auth methods
- **Database**: Use any database (PostgreSQL, MySQL, MongoDB, etc.)

## Support

The frontend is fully functional with mock APIs. Replace the placeholder API routes with your actual backend implementation to make it production-ready. 