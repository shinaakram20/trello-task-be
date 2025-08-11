# Trello App Backend API

A robust, scalable backend API for a Trello-like task management application built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **RESTful API** for boards, lists, tasks, comments, and activity tracking
- **Real-time updates** with efficient database operations
- **Drag & Drop support** for reordering lists and tasks
- **User activity logging** for audit trails
- **Comment system** for task collaboration
- **Position management** for maintaining order in lists and tasks
- **Database migrations** for easy schema management
- **Seeding system** for development and testing

## 🛠️ Tech Stack

### Core Technologies
- **Node.js** (v18+) - JavaScript runtime
- **Express.js** (v4.18+) - Web application framework
- **PostgreSQL** - Primary database
- **Supabase** - Database hosting and management

### Key Dependencies
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **pg** - PostgreSQL client for Node.js
- **postgres** - Alternative PostgreSQL client

### Development Tools
- **nodemon** - Development server with auto-restart
- **ES6 Modules** - Modern JavaScript import/export syntax

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or hosted)
- **Supabase** account (recommended for hosting)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd trello-app/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the environment example file and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/trello_db

# Supabase Configuration (if using Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Database Setup

#### Option A: Local PostgreSQL
```bash
# Create database
createdb trello_db

# Run migrations
npm run migrate

# Seed with sample data (optional)
npm run seed
```

#### Option B: Supabase
```bash
# Run migrations against your Supabase database
npm run migrate

# Seed with sample data (optional)
npm run seed
```

### 5. Start the Server

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── activityController.js
│   │   ├── boardController.js
│   │   ├── commentController.js
│   │   ├── listController.js
│   │   └── taskController.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.js
│   ├── routes/              # API route definitions
│   │   ├── activity.js
│   │   ├── boards.js
│   │   ├── comments.js
│   │   ├── lists.js
│   │   └── tasks.js
│   ├── services/            # Business logic
│   │   ├── activityService.js
│   │   ├── boardService.js
│   │   ├── commentService.js
│   │   ├── databaseService.js
│   │   ├── listService.js
│   │   └── taskService.js
│   └── server.js            # Main server file
├── migrations/              # Database schema migrations
│   ├── 001_create_users_table.sql
│   ├── 002_create_boards_table.sql
│   ├── 003_create_lists_table.sql
│   ├── 004_create_tasks_table.sql
│   ├── 005_add_missing_columns.sql
│   ├── 006_create_activity_log_table.sql
│   ├── 007_create_comments_table.sql
│   ├── migrate.js
│   ├── rollback.js
│   └── README.md
├── package.json
├── env.example
└── README.md
```

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts and authentication
- **boards** - Project boards
- **lists** - Task lists within boards
- **tasks** - Individual tasks with metadata
- **comments** - Task comments and discussions
- **activity_log** - User activity tracking

### Key Relationships

- Boards contain multiple Lists
- Lists contain multiple Tasks
- Tasks can have multiple Comments
- All actions are logged in Activity Log

## 🔌 API Endpoints

### Health Check
- `GET /health` - Server health status

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get board by ID
- `POST /api/boards` - Create new board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Lists
- `GET /api/lists` - Get all lists
- `GET /api/lists/:id` - Get list by ID
- `GET /api/lists/board/:boardId` - Get lists by board
- `POST /api/lists` - Create new list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list
- `PATCH /api/lists/positions` - Update list positions (bulk)

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `GET /api/tasks/list/:listId` - Get tasks by list
- `GET /api/tasks/board/:boardId` - Get tasks by board
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/move` - Move task to different list
- `PATCH /api/tasks/:id/position` - Update task position
- `PATCH /api/tasks/positions` - Update task positions (bulk)

### Comments
- `GET /api/comments/task/:taskId` - Get comments by task
- `POST /api/comments` - Create new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Activity
- `GET /api/activity/board/:boardId` - Get board activity
- `GET /api/activity/user/:userId` - Get user activity

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon

# Production
npm start            # Start production server

# Database Management
npm run migrate      # Run database migrations
npm run migrate:rollback      # Rollback last migration
npm run migrate:rollback:all  # Rollback all migrations

# Data Management
npm run seed         # Seed database with sample data
npm run clear-data   # Clear all data (development only)

# Testing
npm test             # Run tests (not implemented yet)
```

## 🌐 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (Frontend development server)
- Custom origins can be added in `server.js`

## 🔐 Authentication

Currently, the API uses basic authentication. JWT implementation is prepared in the environment configuration.

## 📊 Database Migrations

### Running Migrations
```bash
npm run migrate
```

### Rolling Back Migrations
```bash
# Rollback last migration
npm run migrate:rollback

# Rollback all migrations
npm run migrate:rollback:all
```

### Migration Files
- `001_create_users_table.sql` - User management
- `002_create_boards_table.sql` - Board structure
- `003_create_lists_table.sql` - List management
- `004_create_tasks_table.sql` - Task structure
- `005_add_missing_columns.sql` - Schema updates
- `006_create_activity_log_table.sql` - Activity tracking
- `007_create_comments_table.sql` - Comment system

## 🌱 Seeding

Populate your database with sample data:

```bash
npm run seed
```

This will create:
- Sample boards
- Sample lists
- Sample tasks
- Sample comments

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:
- `DATABASE_URL` - Production database connection
- `NODE_ENV=production`
- `PORT` - Production port (if different from default)

### Process Management
Use a process manager like PM2 for production:

```bash
npm install -g pm2
pm2 start src/server.js --name "trello-api"
pm2 save
pm2 startup
```

## 🧪 Testing

Testing framework is not yet implemented. Consider adding:
- Jest for unit testing
- Supertest for API testing
- PostgreSQL test containers for integration tests

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Migration Errors**
   - Check database permissions
   - Ensure all previous migrations are applied
   - Review migration file syntax

3. **CORS Issues**
   - Verify frontend URL in CORS configuration
   - Check browser console for CORS errors

### Logs
Check server logs for detailed error information:
```bash
npm run dev  # Development logs
# or
npm start    # Production logs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review API documentation
- Open an issue on GitHub

---

**Happy Coding! 🎉**
