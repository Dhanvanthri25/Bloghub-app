import Blog from '../models/Blog.js';

export const getUserProfileWithBlogs = async (req, res, next) => {
  try {
    const user = req.user;

    // Get all blogs authored by the user
    const blogs = await Blog.find({ author: user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        user,
        blogs
      }
    });
  } catch (error) {
    next(error);
  }
};
