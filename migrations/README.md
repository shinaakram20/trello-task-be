# Database Migrations

This directory contains the database migration files and scripts for the Trello backend application.

## Migration Files

### 001_create_users_table.sql
- Creates the `users` table for user authentication
- Includes email field with unique constraint
- Adds indexes for performance optimization

### 002_create_boards_table.sql
- Creates the `boards` table for project boards
- References `users` table with CASCADE delete
- Includes indexes for user_id and created_at

### 003_create_lists_table.sql
- Creates the `lists` table for organizing tasks
- References `boards` table with CASCADE delete
- Includes position field with unique constraint per board
- Adds composite index for board_id + position

### 004_create_tasks_table.sql
- Creates the `tasks` table for individual task items
- References `lists` table with CASCADE delete
- Includes position field with unique constraint per list
- Adds composite index for list_id + position

## Running Migrations

### Apply All Migrations
```bash
npm run migrate
```

This will:
1. Connect to your database using the `DATABASE_URL` environment variable
2. Create a `migrations` table to track executed migrations
3. Run all migration files in order
4. Skip already executed migrations
5. Mark successful migrations as completed

### Rollback Last Migration
```bash
npm run migrate:rollback
```

This will:
1. Identify the last executed migration
2. Rollback the changes for that migration
3. Remove the migration record from the migrations table

### Rollback All Migrations
```bash
npm run migrate:rollback:all
```

This will:
1. Drop all tables in the correct order (respecting foreign key constraints)
2. Clear the migrations table
3. **Warning**: This will delete all data!

## Migration Scripts

### migrate.js
- Main migration runner
- Tracks executed migrations in a `migrations` table
- Supports idempotent execution (safe to run multiple times)
- Uses transactions for atomicity

### rollback.js
- Provides rollback functionality
- Can rollback the last migration or all migrations
- Handles foreign key constraints properly

## Database Schema

The migrations create the following structure:

```
users
├── id (UUID, Primary Key)
└── email (TEXT, Unique)

boards
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → users.id)
├── title (TEXT)
└── created_at (TIMESTAMP)

lists
├── id (UUID, Primary Key)
├── board_id (UUID, Foreign Key → boards.id)
├── title (TEXT)
├── position (INT)
└── created_at (TIMESTAMP)

tasks
├── id (UUID, Primary Key)
├── list_id (UUID, Foreign Key → lists.id)
├── title (TEXT)
├── description (TEXT)
├── position (INT)
└── created_at (TIMESTAMP)
```

## Foreign Key Relationships

All foreign keys use `ON DELETE CASCADE`:
- Deleting a user deletes all their boards
- Deleting a board deletes all its lists
- Deleting a list deletes all its tasks

## Indexes

Performance indexes are created for:
- `users.email` - Fast user lookups
- `boards.user_id` - Fast board queries by user
- `boards.created_at` - Fast sorting by creation date
- `lists.board_id` - Fast list queries by board
- `lists.position` - Fast position-based queries
- `tasks.list_id` - Fast task queries by list
- `tasks.position` - Fast position-based queries

## Constraints

- Unique constraints ensure no duplicate positions within the same board/list
- Foreign key constraints maintain referential integrity
- CASCADE deletes ensure data consistency

## Environment Requirements

Before running migrations, ensure you have:

1. **Database URL**: Set `DATABASE_URL` in your `.env` file
2. **Database Access**: The database user must have CREATE, DROP, and ALTER permissions
3. **Network Access**: Ability to connect to your PostgreSQL database

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check your `DATABASE_URL` and network connectivity
2. **Permission Denied**: Ensure your database user has sufficient privileges
3. **Migration Already Applied**: The script will skip already executed migrations
4. **Rollback Failed**: Check for any active connections or locks on the tables

### Manual Migration

If the automated scripts fail, you can run migrations manually:

```sql
-- Connect to your database and run each migration file manually
\i migrations/001_create_users_table.sql
\i migrations/002_create_boards_table.sql
\i migrations/003_create_lists_table.sql
\i migrations/004_create_tasks_table.sql
```

### Checking Migration Status

Query the migrations table to see which migrations have been applied:

```sql
SELECT * FROM migrations ORDER BY id;
```

## Best Practices

1. **Always backup** your database before running migrations in production
2. **Test migrations** in a development environment first
3. **Review migration files** before applying them
4. **Use transactions** (already implemented in the scripts)
5. **Monitor execution** and check logs for any errors
