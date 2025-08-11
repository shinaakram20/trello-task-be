# Database Migrations

This directory contains database migrations for the Trello app.

## Migration Order

1. **001_create_users_table.sql** - Create users table
2. **002_create_boards_table.sql** - Create boards table
3. **003_create_lists_table.sql** - Create lists table with foreign key to boards
4. **004_create_tasks_table.sql** - Create tasks table with foreign key to lists
5. **005_add_missing_columns.sql** - Add missing columns to existing tables
6. **006_create_activity_log_table.sql** - Create activity logging table
7. **007_create_comments_table.sql** - Create comments table
8. **008_fix_delete_constraints.sql** - Fix foreign key constraints for proper cascade deletion

## Running Migrations

To run all migrations:

```bash
node migrate.js
```

To rollback migrations:

```bash
node rollback.js
```

## Important Notes

- **Migration 008** is critical for proper delete functionality
- It ensures that deleting a board will cascade to delete all its lists and tasks
- It ensures that deleting a list will cascade to delete all its tasks
- Foreign key constraints are properly configured with ON DELETE CASCADE
