import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { fetchBlogs } from '../store/slices/blogSlice';
import BlogCard from '../components/Blog/BlogCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import { Edit3, BookOpen, Users, TrendingUp } from 'lucide-react';
import ReactPaginate from 'react-paginate';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogs);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const itemsPerPage = 6;
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = blogs.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(blogs.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              Share Your
              <span className="text-primary-600 dark:text-primary-400"> Stories</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up">
              A modern blogging platform where writers connect with readers. 
              Share your thoughts, experiences, and insights with the world.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Writing
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-primary-600 text-primary-600 dark:text-primary-400 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white dark:hover:text-white transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{blogs.length}+</h3>
              <p className="text-gray-600 dark:text-gray-300">Published Articles</p>
            </div>
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-full mb-4">
                <Users className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">50+</h3>
              <p className="text-gray-600 dark:text-gray-300">Active Writers</p>
            </div>
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1K+</h3>
              <p className="text-gray-600 dark:text-gray-300">Monthly Readers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Stories
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Discover the most recent articles from our community
            </p>
          </div>

          {error && (
            <ErrorMessage message={error} className="mb-8" />
          )}

          {blogs.length === 0 && !loading ? (
            <div className="text-center py-12">
              <Edit3 className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No stories yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Be the first to share your story with the community!
              </p>
              {isAuthenticated && (
                <Link
                  to="/create"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
                >
                  Write Your First Post
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>

              {blogs.length > itemsPerPage && (
                <div className="mt-12 flex justify-center">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="→"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="←"
                    containerClassName="flex items-center space-x-2"
                    pageClassName="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700"
                    pageLinkClassName="text-gray-700 dark:text-gray-300"
                    previousClassName="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700"
                    nextClassName="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700"
                    activeClassName="bg-primary-600 text-white"
                    disabledClassName="opacity-50 cursor-not-allowed"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
