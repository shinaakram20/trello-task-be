import { ActivityService } from '../services/activityService.js';

const activityService = new ActivityService();

// Get board activity
export const getBoardActivity = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { limit = 50 } = req.query;
    
    const activity = await activityService.getBoardActivity(boardId, parseInt(limit));
    res.json(activity);
  } catch (error) {
    console.error('Error getting board activity:', error);
    res.status(500).json({ error: 'Failed to get board activity' });
  }
};

// Get user activity
export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;
    
    const activity = await activityService.getUserActivity(userId, parseInt(limit));
    res.json(activity);
  } catch (error) {
    console.error('Error getting user activity:', error);
    res.status(500).json({ error: 'Failed to get user activity' });
  }
};
