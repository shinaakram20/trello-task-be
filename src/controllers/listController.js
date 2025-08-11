import { ListService } from '../services/listService.js';

const listService = new ListService();

// Get all lists
export const getLists = async (req, res) => {
  try {
    const lists = await listService.getAllLists();
    res.json(lists);
  } catch (error) {
    console.error('Error getting lists:', error);
    res.status(500).json({ error: 'Failed to get lists' });
  }
};

// Get lists by board
export const getListsByBoard = async (req, res) => {
  try {
    const boardId = req.params.boardId || req.params.id;
    const lists = await listService.getListsByBoard(boardId);
    res.json(lists);
  } catch (error) {
    console.error('Error getting lists by board:', error);
    res.status(500).json({ error: 'Failed to get lists' });
  }
};

// Get a specific list
export const getList = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await listService.getListById(id);
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    console.error('Error getting list:', error);
    res.status(500).json({ error: 'Failed to get list' });
  }
};

// Create a new list
export const createList = async (req, res) => {
  try {
    const { title, boardId, position } = req.body;
    
    if (!title || !boardId) {
      return res.status(400).json({ error: 'Title and boardId are required' });
    }
    
    const list = await listService.createList({
      title,
      boardId,
      position,
    });
    
    res.status(201).json(list);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ error: 'Failed to create list' });
  }
};

// Update a list
export const updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, position } = req.body;

    // Filter out undefined values
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (position !== undefined) updateData.position = position;
    
    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const list = await listService.updateList(id, updateData);
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ error: 'Failed to update list' });
  }
};

// Update multiple list positions (for drag and drop reordering)
export const updateListPositions = async (req, res) => {
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
    
    const updatedLists = await listService.updateListPositions(updates);
    
    res.json(updatedLists);
  } catch (error) {
    console.error('Error updating list positions:', error);
    res.status(500).json({ error: 'Failed to update list positions' });
  }
};

// Delete a list
export const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await listService.deleteList(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ error: 'Failed to delete list' });
  }
};
