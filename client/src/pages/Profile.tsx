import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { RootState, AppDispatch } from '../store';
import { getCurrentUser } from '../store/slices/authSlice';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { User, Calendar, Edit3, Eye, Plus } from 'lucide-react';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [userBlogs, setUserBlogs] = React.useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await dispatch(getCurrentUser()).unwrap();
        setUserBlogs(result.data.blogs || []);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your profile
          </h1>
          <Link
            to="/login"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full">
                <User className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Write New Post</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center animate-scale-in">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {userBlogs.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Published Posts
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">
              {userBlogs.reduce((total, blog) => total + (blog.views || 0), 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Total Views
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">
              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: false })}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Writing Journey
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Blog Posts
            </h2>
            {userBlogs.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {userBlogs.length} post{userBlogs.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {userBlogs.length === 0 ? (
            <div className="text-center py-12">
              <Edit3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No blog posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start sharing your thoughts and ideas with the world!
              </p>
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>Write Your First Post</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 mb-3 md:mb-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        <Link
                          to={`/blog/${blog._id}`}
                          className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                        >
                          {blog.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                        </span>
                        {blog.tags && blog.tags.length > 0 && (
                          <span>
                            {blog.tags.slice(0, 2).join(', ')}
                            {blog.tags.length > 2 && ` +${blog.tags.length - 2}`}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/blog/${blog._id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                      <Link
                        to={`/blog/${blog._id}/edit`}
                        className="inline-flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;