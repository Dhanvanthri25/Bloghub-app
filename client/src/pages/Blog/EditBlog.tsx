import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchBlogById, updateBlog } from '../../store/slices/blogSlice';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentBlog, loading } = useSelector((state: RootState) => state.blogs);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    published: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentBlog) {
      setFormData({
        title: currentBlog.title || '',
        content: currentBlog.content || '',
        tags: currentBlog.tags.join(', ') || '',
        published: currentBlog.published ?? true,
      });
    }
  }, [currentBlog]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    const newValue = type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const tagsArray = formData.tags.split(',').map((tag) => tag.trim());

    try {
      await dispatch(updateBlog({
        id,
        blogData: {
          ...formData,
          tags: tagsArray,
        },
      })).unwrap();

      toast.success('Blog updated successfully!');
      navigate(`/blog/${id}`);
    } catch (err: any) {
      toast.error(err || 'Failed to update blog');
    }
  };

  if (loading || !currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              className="w-full p-2 rounded border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={8}
              className="w-full p-2 rounded border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full p-2 rounded border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              id="published"
              className="h-4 w-4"
            />
            <label htmlFor="published" className="text-sm text-gray-700 dark:text-gray-300">
              Published
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Update Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
