import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header =()=> {
  const { totalItems } = useSelector((state) => state.cart);

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top border-bottom">
      <div className="container">
        {/* Logo */}
        <div className="navbar-brand d-flex align-items-center">
          <div className="bg-primary text-white rounded p-2 me-2">
            <i className="fas fa-store"></i>
          </div>
          <h3 className="mb-0 text-primary fw-bold">Our Products</h3>
        </div>

        {/* Cart Button */}
        <Link to="/cart" type="button" className="btn btn-primary position-relative">
          <i className="fas fa-shopping-cart me-2"></i> Cart {totalItems > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalItems} </span>
            )}
        </Link>
      </div>
    </header>
  );
};

export default Header;