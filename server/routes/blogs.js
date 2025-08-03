import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog
} from '../Controllers/blogController.js';

const router = express.Router();

// GET all published blogs 
router.get('/', getAllBlogs);

// GET a single blog
router.get('/:id', getSingleBlog);

// CREATE a new blog (protected)
router.post(
  '/',
  protect,
  [
    body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters')
  ],
  createBlog
);

// UPDATE a blog (protected, author only)
router.put(
  '/:id',
  protect,
  [
    body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    body('content').optional().trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters')
  ],
  updateBlog
);

// DELETE a blog (protected, author only)
router.delete('/:id', protect, deleteBlog);

export default router;
