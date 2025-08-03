// App.tsx
import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
  Outlet,
} from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { checkAuth, getCurrentUser } from './store/slices/authSlice';
import { initializeTheme } from './store/slices/themeSlice';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CreateBlog from './pages/Blog/CreateBlog';
import BlogDetail from './pages/Blog/BlogDetail';
import Profile from './pages/Profile';
import { RootState, AppDispatch } from './store';
import EditBlog from './pages/Blog/EditBlog';

const AppWrapper: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(initializeTheme());
    dispatch(checkAuth());

    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
        }}
      />
    </>
  );
};

// Routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppWrapper />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'blog/:id', element: <BlogDetail /> },
      { path: 'blog/:id/edit', element: <EditBlog /> },

      { path: 'profile', element: <Profile /> },
      {
        path: 'create',
        element: (
          <PrivateRoute>
            <CreateBlog />
          </PrivateRoute>
        ),
      },
      // {
      //   path: 'profile',
      //   element: (
      //     <PrivateRoute>
      //       <Profile />
      //     </PrivateRoute>
      //   ),
      // },
    ],
  },
];
const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  } as any,
});


const App: React.FC = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
