# Neighborhood Portal Backend

## Database Setup Instructions

### Prerequisites
- MySQL 8.0 or higher installed
- MySQL running on localhost:3306 (or configure your host/port)

### Step 1: Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE neighborhood_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE neighborhood_portal;
```

### Step 2: Run Schema
```bash
mysql -u root -p neighborhood_portal < database/schema.sql
```

Or from MySQL prompt:
```sql
USE neighborhood_portal;
source /path/to/backend/database/schema.sql;
```

### Step 3: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=neighborhood_portal
JWT_SECRET=your_secure_random_secret_key
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Run Backend
Development mode with auto-reload:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## Database Schema

### Table 1: Users
- **id** (PK): Auto-increment
- **name**: User's full name
- **contact_info**: Email/phone (unique)
- **location**: User's address
- **role**: resident | helper | admin
- **password**: Bcrypt hashed password
- **created_at**: Timestamp

### Table 2: HelpRequests
- **id** (PK): Auto-increment
- **resident_id** (FK → Users): Request creator
- **helper_id** (FK → Users): Assigned helper (nullable)
- **title**: Request title
- **description**: Detailed description
- **category**: plumbing, grocery, tutoring, etc.
- **status**: pending | accepted | in_progress | completed
- **attachments**: Optional file URLs
- **created_at**: Timestamp
- **updated_at**: Auto-updated timestamp

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login
- `GET /api/users/me` - Get current user (protected)
- `GET /api/users/:id` - Get user by ID (protected)
- `PUT /api/users/:id` - Update user profile (protected)

### Help Requests
- `POST /api/requests` - Create request (Residents only)
- `GET /api/requests` - Get all requests (with filters)
- `GET /api/requests/:id` - Get single request
- `PUT /api/requests/:id/status` - Update request status

### Query Parameters for GET /api/requests
- `status`: Filter by status (pending, accepted, in_progress, completed)
- `resident_id`: Filter by resident
- `helper_id`: Filter by helper (use 'null' for unassigned)

## Status Workflow Rules
```
pending → accepted → in_progress → completed
```

Invalid transitions are rejected with 400 error.

## Testing

Health check:
```bash
curl http://localhost:3000/health
```

Register user:
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "contact_info": "test@example.com",
    "location": "123 Test St",
    "role": "resident",
    "password": "password123"
  }'
```
