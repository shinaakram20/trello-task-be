import { BoardService } from '../services/boardService.js';

const boardService = new BoardService();

// Get all boards
export const getBoards = async (req, res) => {
  try {
    const boards = await boardService.getAllBoards();
    res.json(boards);
  } catch (error) {
    console.error('Error getting boards:', error);
    res.status(500).json({ error: 'Failed to get boards' });
  }
};

// Get a specific board
export const getBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await boardService.getBoardById(id);
    
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    res.json(board);
  } catch (error) {
    console.error('Error getting board:', error);
    res.status(500).json({ error: 'Failed to get board' });
  }
};

// Create a new board
export const createBoard = async (req, res) => {
  try {
    const { title, description, color } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const board = await boardService.createBoard({
      title,
      description,
      color
    });
    
    res.status(201).json(board);
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
};

// Update a board
export const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, color } = req.body;
    
    // Filter out undefined values
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    
    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    const board = await boardService.updateBoard(id, updateData);
    
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    res.json(board);
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
};

// Delete a board
export const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await boardService.deleteBoard(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
};
