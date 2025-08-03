import express from 'express';
import { protect } from '../middleware/auth.js';
import { getUserProfileWithBlogs } from '../Controllers/userController.js';

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user profile with their blogs
// @access  Private
router.get('/me', protect, getUserProfileWithBlogs);

export default router;
