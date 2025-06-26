import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Unauthorized from './components/Unauthorized';
import Dashboard from './components/Dashboard';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Header from './components/Header';

// Utility to get current user from localStorage
const getUser = () => JSON.parse(localStorage.getItem('user'));

// Protects routes that require authentication
const PrivateRoute = () => {
  const user = getUser();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Prevents access to login/signup for authenticated users
const PublicRoute = () => {
  const user = getUser();
  const location = useLocation();

  if (!user) return <Outlet />;

  const redirectPath = user.isAdmin ? '/dashboard' : '/';
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Router>
      <div style={{ height: '100vh' }}>
        <Navbar />
        <div className="container">
          <Header />
        </div>
        <div className="container d-flex align-items-center justify-content-center mt-5">
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cart" element={<Cart />} />
            </Route>

            {/* Open Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductCard />} />
            <Route path="*" element={<Unauthorized />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
