# Help Hive - Neighborhood Community Help Portal

A full-stack web application connecting neighbors who need help with those willing to provide assistance. Built with Angular 18, Node.js, GraphQL, BetterAuth, Zod, TypeScript, and MySQL.

## 🌟 Features

### For Requesters (Residents)
- **Create Help Requests** with detailed information:
  - Title and description
  - Category (General, Plumbing, Electrical, Grocery, etc.)
  - Location (full address with privacy controls)
  - Urgency flag
  - Complexity level (Low, Medium, High)
  - Estimated duration
  - Preferred time
- **View Offers** from multiple helpers
- **Accept Helpers** to assign tasks
- **Track Progress** through request timeline
- **Auto-approved** upon registration

### For Helpers
- **Browse Available Requests** in the community
- **Make Offers** to help with specific requests
- **Update Status** (Start Task, Mark Complete)
- **View Assigned Tasks** organized by status:
  - Accepted Tasks
  - In-Progress Tasks
  - Completed Tasks
- **Requires Admin Approval** before offering help

### For Admins
- **Approve Helpers** who register
- **View All Requests** across the platform
- **Manage Requests** (delete if needed)
- **Dashboard Statistics** showing total, pending, active, and completed requests
- **User Management** capabilities

### General Features
- **BetterAuth Authentication** with secure session management
- **Session Persistence** - stay logged in across page refreshes
- **Role-Based Access Control** (Requester, Helper, Admin)
- **GraphQL API** - Single, efficient API interface
- **Zod Validation** - Type-safe input validation
- **Responsive Design** with Bootstrap 5
- **Privacy Controls** - show full address only to involved parties

## 🛠️ Tech Stack

### Frontend
- **Angular 18** - Modern web framework with standalone components
- **TypeScript** - Type-safe development
- **Bootstrap 5** - Responsive CSS framework
- **RxJS** - Reactive programming
- **Signals** - State management

### Backend
- **Node.js** - Runtime environment
- **GraphQL** - API query language
- **Apollo Server Express** - GraphQL server
- **BetterAuth** - Modern authentication library
- **Zod** - TypeScript-first schema validation
- **TypeScript** - Type-safe backend
- **MySQL2** - Database driver
- **ts-node** - TypeScript execution

### Database
- **MySQL** - Relational database
- **2-Table Design**:
  - Users (with roles and approval status)
  - HelpRequests (with JSON fields for offers and timeline)

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd capstone
```

### 2. Database Setup

**Create Database:**
```bash
mysql -u root -p
CREATE DATABASE neighborhood_portal;
EXIT;
```

**Import Schema:**
```bash
cd backend/database
mysql -u root -p neighborhood_portal < schema.sql
```

### 3. Backend Setup

**Install Dependencies:**
```bash
cd backend
npm install
```

**Configure Environment:**
Create `.env` file in `backend/` directory:
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=neighborhood_portal
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Start Backend:**
```bash
npm run dev
```
Backend runs on http://localhost:3001

### 4. Frontend Setup

**Install Dependencies:**
```bash
cd frontend
npm install
```

**Start Frontend:**
```bash
npm start
# or
ng serve
```
Frontend runs on http://localhost:4200

## 👥 User Accounts

### Demo Accounts (from schema.sql)
- **Requester**: alice@test.com / password
- **Helper**: bob@test.com / password
- **Admin**: admin@portal.com / password

### Create New Account
1. Go to http://localhost:4200/register
2. Fill in:
   - Name
   - Email
   - Full Address
   - Role (Requester or Helper)
   - Password (minimum 6 characters)
3. Click "CREATE ACCOUNT"
   - **Requesters**: Auto-approved, redirect to dashboard
   - **Helpers**: Requires admin approval before making offers

## 📖 How to Use

### Creating a Help Request (Requester)
1. Login as a requester
2. Navigate to Dashboard
3. Click "+ Create Request"
4. Fill in the form:
   - **Title**: Brief description (e.g., "Fix leaking sink")
   - **Description**: Detailed explanation
   - **Category**: Select from dropdown
   - **Full Address**: Your location
   - **Complexity**: Low/Medium/High
   - **Duration**: Estimated time (e.g., "2 hours")
   - **Preferred Time**: When you're available (e.g., "Weekends")
   - **Mark as Urgent**: Toggle if urgent
5. Click "POST REQUEST"

### Offering Help (Helper)
1. Login as an approved helper
2. Browse "Available Requests"
3. Click "Offer Help" on a request
4. Wait for requester to accept your offer

### Accepting Help (Requester)
1. View your request with offers
2. Review helper profiles
3. Click "Accept" on preferred helper
4. Request status changes to "Accepted"

### Completing Tasks (Helper)
1. View "My Accepted Tasks"
2. Click "Start Task" when beginning
3. Click "Finish Task" when complete
4. Request shows as "Completed"

### Approving Helpers (Admin)
1. Login as admin
2. View "Pending Helpers" section
3. Click "Approve" next to helper's name
4. Helper can now make offers

## 📁 Project Structure

```
neighborhood-community-help-portal/
├── backend/
│   ├── src/
│   │   ├── graphql/
│   │   │   ├── schema.ts             # GraphQL type definitions
│   │   │   ├── resolvers.ts          # GraphQL resolvers
│   │   │   └── index.ts              # GraphQL setup
│   │   ├── zod/
│   │   │   ├── userSchemas.ts        # User validation schemas
│   │   │   ├── requestSchemas.ts     # Request validation schemas
│   │   │   └── index.ts              # Zod exports
│   │   ├── betterAuth/
│   │   │   ├── config.ts             # BetterAuth configuration
│   │   │   └── index.ts              # BetterAuth exports
│   │   ├── modules/
│   │   │   ├── userModule.ts         # User business logic
│   │   │   ├── requestModule.ts      # Request business logic
│   │   │   └── index.ts              # Module exports
│   │   ├── database/
│   │   │   └── index.ts              # Database connection
│   │   ├── utils/
│   │   │   └── index.ts              # Utility functions
│   │   └── index.ts                  # Entry point
│   ├── database/
│   │   └── schema.sql                # Database schema
│   ├── .env                          # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/           # Route guards
│   │   │   │   └── interceptors/     # HTTP interceptors
│   │   │   ├── shared/
│   │   │   │   └── models/           # Shared models/types
│   │   │   ├── modules/
│   │   │   │   └── main/             # Main feature module
│   │   │   │       └── components/   # Feature components
│   │   │   ├── services/             # Application services
│   │   │   ├── graphql/              # GraphQL client setup
│   │   │   ├── auth/                 # Auth components/services
│   │   │   ├── app-routing.module.ts
│   │   │   ├── app.component.ts
│   │   │   └── app.module.ts
│   │   ├── styles.css                # Global styles
│   │   ├── index.html                # Main HTML
│   │   └── main.ts                   # Bootstrap
│   ├── public/                       # Static assets
│   ├── angular.json                  # Angular config
│   ├── tsconfig.json                 # TypeScript config
│   ├── tsconfig.app.json             # App TypeScript config
│   ├── tsconfig.spec.json            # Test TypeScript config
│   └── package.json
│
└── shared/
    └── types.ts                      # Shared TypeScript types
```

## 🗄️ Database Schema

### Users Table
```sql
- id (PRIMARY KEY)
- name
- contact_info (UNIQUE)
- email
- location
- full_address
- abstract_address
- role (ENUM: resident, helper, admin, requester)
- password (hashed with bcrypt)
- is_approved (BOOLEAN)
- created_at (TIMESTAMP)
```

### HelpRequests Table
```sql
- id (PRIMARY KEY)
- resident_id (FOREIGN KEY → Users)
- requester_id
- requester_name
- helper_id (FOREIGN KEY → Users, nullable)
- helper_name
- title
- description
- category
- status (VARCHAR: pending, offered, accepted, in_progress, completed)
- attachments
- full_address
- abstract_address
- is_urgent (BOOLEAN)
- complexity (ENUM: Low, Medium, High)
- estimated_duration
- preferred_time
- offers (JSON array of helper offers)
- timeline (JSON array of status changes)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔌 GraphQL API

The backend provides a single GraphQL endpoint at `/graphql` with full type safety and validation.

### Authentication Mutations
```graphql
mutation Register($input: CreateUserInput!) {
  register(input: $input) {
    success
    data {
      user {
        id
        name
        contact_info
        role
        is_approved
      }
      token
    }
    message
  }
}

mutation Login($input: LoginInput!) {
  login(input: $input) {
    success
    data {
      user {
        id
        name
        contact_info
        role
        is_approved
      }
      token
    }
    message
  }
}
```

### User Queries & Mutations
```graphql
query GetUsers {
  users {
    success
    data {
      id
      name
      contact_info
      role
      is_approved
    }
  }
}

query GetCurrentUser {
  me {
    success
    data {
      id
      name
      contact_info
      role
      is_approved
    }
  }
}

mutation ApproveHelper($id: ID!) {
  approveHelper(id: $id) {
    success
    data {
      id
      name
      is_approved
    }
    message
  }
}
```

### Request Queries & Mutations
```graphql
query GetRequests($status: RequestStatus, $category: String, $limit: Int, $offset: Int) {
  requests(status: $status, category: $category, limit: $limit, offset: $offset) {
    success
    data {
      id
      title
      description
      category
      status
      is_urgent
      complexity
      offers {
        helperId
        helperName
        offeredAt
      }
      timeline {
        status
        timestamp
        note
      }
    }
  }
}

query GetMyRequests {
  myRequests {
    success
    data {
      id
      title
      status
      offers {
        helperId
        helperName
      }
    }
  }
}

mutation CreateRequest($input: CreateRequestInput!) {
  createRequest(input: $input) {
    success
    data {
      id
      title
      status
    }
    message
  }
}

mutation MakeOffer($requestId: ID!, $input: MakeOfferInput!) {
  makeOffer(requestId: $requestId, input: $input) {
    success
    message
  }
}
```

### Statistics & Admin Queries
```graphql
query GetStats {
  stats {
    success
    data {
      total
      pending
      active
      completed
    }
  }
}

query GetUnapprovedHelpers {
  unapprovedHelpers {
    success
    data {
      id
      name
      contact_info
    }
  }
}
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: 7-day token expiration
- **HTTP-Only Tokens**: Stored in localStorage (client-side)
- **Role-Based Access**: Middleware authorization
- **Input Validation**: Request validation middleware
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configured for development

## 🎨 Design Highlights

- **Color Scheme**: Yellow/Amber theme ("Hive" branding)
- **Typography**: Serif headings, sans-serif body
- **Components**: Card-based layout
- **Animations**: Smooth transitions and hover effects
- **Icons**: SVG icons for better quality
- **Responsive**: Mobile-first design

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql -u root -p`
- Verify `.env` credentials are correct
- Ensure port 3001 is not in use

### Frontend won't start
- Clear node_modules: `rm -rf node_modules && npm install`
- Check port 4200 is available
- Verify Angular CLI is installed: `npm install -g @angular/cli`

### Cannot login
- Check password is at least 6 characters
- For helpers, verify admin approval
- Clear localStorage and try again

### 401 Unauthorized errors
- Token may be expired (7 days)
- Logout and login again
- Check if JWT_SECRET matches between sessions

### Data not displaying
- Check browser console for errors
- Verify backend is running
- Check network tab for API responses

## 📝 Development Notes

### Architecture Overview

#### Backend Architecture
- **GraphQL**: Single API endpoint with type-safe queries and mutations
- **BetterAuth**: Modern authentication with session management
- **Zod**: Runtime type validation for all inputs
- **Clean Architecture**: Separated concerns with dedicated folders for each responsibility

#### Frontend Architecture
- **Angular 18**: Modern framework with standalone components
- **Bootstrap 5**: Responsive CSS framework
- **Feature Modules**: Organized components by feature
- **Signal-based State**: Reactive state management

### Code Conventions
- **Backend**: snake_case for database fields, camelCase for TypeScript
- **Frontend**: camelCase throughout
- **GraphQL**: camelCase for field names, PascalCase for types
- **Validation**: Zod schemas for all input validation
- **Error Handling**: Structured error responses with proper HTTP codes

### Key Design Decisions
1. **GraphQL over REST**: Single, efficient API with exact data fetching
2. **BetterAuth**: Modern auth library replacing custom JWT implementation
3. **Zod Validation**: Runtime type safety and input sanitization
4. **Clean Separation**: Dedicated folders for GraphQL, Auth, Validation, and Business Logic
5. **Bootstrap over Tailwind**: More maintainable CSS with utility classes
6. **Angular 18**: LTS version with improved performance and features
7. **Manual Approval**: Helpers vetted before participating for quality control

## 🚧 Future Enhancements

- [ ] Real-time notifications (WebSocket/Socket.io)
- [ ] File upload for attachments
- [ ] Email notifications
- [ ] Password reset functionality
- [ ] User profiles with ratings/reviews
- [ ] Search and filter requests
- [ ] Map view of nearby requests
- [ ] Mobile app (React Native/Flutter)
- [ ] Admin analytics dashboard
- [ ] Chat between requester and helper

## 📄 License

This project is created as a capstone project for educational purposes.

## 👨‍💻 Author

Developed as a neighborhood community help portal capstone project.

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.
