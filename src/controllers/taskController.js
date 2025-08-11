import { TaskService } from '../services/taskService.js';

const taskService = new TaskService();

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

// Get tasks by list
export const getTasksByList = async (req, res) => {
  try {
    const listId = req.params.listId || req.params.id;
    const tasks = await taskService.getTasksByList(listId);
    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks by list:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

// Get tasks by board
export const getTasksByBoard = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const tasks = await taskService.getTasksByBoard(boardId);
    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks by board:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

// Get a specific task
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({ error: 'Failed to get task' });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, listId, position, dueDate, priority, status } = req.body;

    if (!title || !listId) {
      return res.status(400).json({ error: 'Title and listId are required' });
    }

    const task = await taskService.createTask({
      title,
      description,
      listId,
      position,
      dueDate,
      priority,
      status
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, position, dueDate, priority, status } = req.body;

    // Filter out undefined values
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (position !== undefined) updateData.position = position;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    
    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const task = await taskService.updateTask(id, updateData);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Move a task to another list
export const moveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { listId, position } = req.body;

    if (!listId) {
      return res.status(400).json({ error: 'listId is required' });
    }

    const task = await taskService.moveTask(id, listId, position);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error moving task:', error);
    res.status(500).json({ error: 'Failed to move task' });
  }
};

// Update task position within the same list
export const updateTaskPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { position } = req.body;

    if (position === undefined || position === null) {
      return res.status(400).json({ error: 'position is required' });
    }

    const task = await taskService.updateTaskPosition(id, position);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task position:', error);
    res.status(500).json({ error: 'Failed to update task position' });
  }
};

// Update multiple task positions (for drag and drop reordering)
export const updateTaskPositions = async (req, res) => {
  try {
    const { updates } = req.body;
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'Updates array is required and must not be empty' });
    }
        
    // Validate that all updates have id and position
    for (const update of updates) {
      if (!update.id || update.position === undefined) {
        return res.status(400).json({ 
          error: 'Each update must have id and position fields' 
        });
      }
    }
    
    const updatedTasks = await taskService.updateTaskPositions(updates);
    
    res.json(updatedTasks);
  } catch (error) {
    console.error('Error updating task positions:', error);
    res.status(500).json({ error: 'Failed to update task positions' });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const deleted = await taskService.deleteTask(id);

    console.log('deleted', deleted);

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found or could not be deleted' });
    }

    res.json({ message: 'Task deleted successfully', taskId: id });
  } catch (error) {
    console.error('Error deleting task:', error);
    
    // Provide more specific error messages
    if (error.code === '23503') { // Foreign key violation
      res.status(400).json({ error: 'Cannot delete task: it has associated data' });
    } else if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Cannot delete task: constraint violation' });
    } else {
      res.status(500).json({ error: 'Failed to delete task. Please try again.' });
    }
  }
};
