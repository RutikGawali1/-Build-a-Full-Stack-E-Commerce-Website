import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import ProductCard from './ProductCard';
import { fetchCart } from '../store/actions/cartActions';

const Home = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
    fetchProducts();
  }, [dispatch, fetchProducts]);

  const groupedProducts = React.useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  }, [products]);

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-4" role="status"></div>
          <h5 className="text-muted">Loading amazing products...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
        <div className="text-center p-4">
          <div className="mb-3">
            <svg className="bi bi-exclamation-triangle text-danger" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7.938 2.016a.13.13 0 0 1 .125 0l6.857 11.856c.06.104.02.24-.094.24H1.174c-.113 0-.153-.136-.094-.24L7.938 2.016zM8 5c-.535 0-.954.462-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
          </div>
          <h2 className="fw-bold text-dark mb-3">Oops! Something went wrong</h2>
          <p className="text-muted mb-4">{error}</p>
          <button className="btn btn-primary d-inline-flex align-items-center" onClick={fetchProducts}>
            <i className="bi bi-arrow-clockwise me-2"></i> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5 w-100">
      <div className="container">
        {Object.keys(groupedProducts).length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4">
              <svg className="bi bi-box text-secondary" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.176.177a1 1 0 0 0-.352 0l-6.5 1.625a1 1 0 0 0-.324 1.755L1 4.723V13a2 2 0 0 0 1.293 1.854l6.5 2.6a1 1 0 0 0 .714 0l6.5-2.6A2 2 0 0 0 15 13V4.723l.999-.666a1 1 0 0 0-.323-1.755l-6.5-1.625zm0 1.641L14.5 3.57v.012l-6.324 2.59a1 1 0 0 1-.685 0L1.5 3.58v-.011L8.176 1.818zM2 5.457l6 2.457v7.314l-5.293-2.117A1 1 0 0 1 2 13V5.457zm7 9.771v-7.314l6-2.457V13a1 1 0 0 1-.707.951L9 15.228z"/>
              </svg>
            </div>
            <h2 className="fw-bold text-dark mb-3">No products found</h2>
            <p className="text-muted">Check back later for new products.</p>
          </div>
        ) : (
          Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <div key={category} className="mb-5">
              <h2 className="fw-bold text-dark mb-2">{category}</h2>
              <div className="bg-primary" style={{ height: '4px', width: '80px', borderRadius: '2px' }}></div>

              <div className="row mt-4">
                {categoryProducts.map(product => (
                  <div key={product._id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
