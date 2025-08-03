import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { RootState, AppDispatch } from '../../store';
import { fetchBlogById, deleteBlog, clearCurrentBlog } from '../../store/slices/blogSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import { Calendar, User, Edit3, Trash2, ArrowLeft, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentBlog, loading, error } = useSelector((state: RootState) => state.blogs);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }

    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!currentBlog) return;

    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await dispatch(deleteBlog(currentBlog._id)).unwrap();
        toast.success('Blog post deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} />
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Blog post not found
            </h1>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = isAuthenticated && user?._id === currentBlog.author._id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6 animate-fade-in">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Posts</span>
          </Link>
        </div>

        {/* Blog Post */}
        <article className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{currentBlog.author.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(currentBlog.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {isAuthor && (
                <div className="flex items-center space-x-2">
                  {/* <Link
                    to={`/blog/${currentBlog._id}/edit`}
                    className="inline-flex items-center space-x-1 px-3 py-2 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors duration-200"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </Link> */}
                  <button
                    onClick={() => navigate(`/blog/${currentBlog._id}/edit`)}
                    className="inline-flex items-center space-x-1 px-3 py-2 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors duration-200"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center space-x-1 px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {currentBlog.title}
            </h1>

            {/* Tags */}
            {currentBlog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentBlog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentBlog.content}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 dark:text-gray-400">
              <div>
                Published on {new Date(currentBlog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {currentBlog.updatedAt !== currentBlog.createdAt && (
                <div className="mt-2 sm:mt-0">
                  Last updated {formatDistanceToNow(new Date(currentBlog.updatedAt), { addSuffix: true })}
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;