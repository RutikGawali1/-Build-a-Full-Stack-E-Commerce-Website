import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    image: '', 
    category: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const categories = [ 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food & Beverages', 'Automotive', 'Health', 'Other' ];

  const getAuthToken = () => { return localStorage.getItem('token'); };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
      setError('');
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/auth/getusers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newProduct.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!newProduct.price || isNaN(newProduct.price) || parseFloat(newProduct.price) <= 0) {
      errors.price = 'Valid price is required (must be greater than 0)';
    }
    
    if (newProduct.image && !isValidUrl(newProduct.image)) {
      errors.image = 'Please enter a valid URL for the image';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAddProduct = async () => {
    
    if (!validateForm()) {
      return;
    }

    try {
      const token = getAuthToken();
      const productData = {
        name: newProduct.name.trim(),
        price: parseFloat(newProduct.price),
        description: newProduct.description.trim() || undefined,
        image: newProduct.image.trim() || undefined,
        category: newProduct.category || undefined
      };

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setNewProduct({ name: '', description: '', price: '', image: '', category: '' });
      setError('');
      setValidationErrors({});
      setSuccess('Product added successfully!');
      await fetchProducts();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding product:', error);
      setError(`Failed to add product: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setError('');
      setSuccess('Product deleted successfully!');
      await fetchProducts();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(`Failed to delete product: ${error.message}`);
    }
  };

  const handleInputChange = (field, value) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div>
      {/* Include Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4 text-primary">
              <i className="fas fa-tachometer-alt me-2"></i>
              Admin Dashboard
            </h1>
            
            {/* Alert Messages */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError('')}
                ></button>
              </div>
            )}
            
            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                {success}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSuccess('')}
                ></button>
              </div>
            )}
          </div>
        </div>

        {/* Products Management Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h3 className="card-title mb-0">
                  <i className="fas fa-box me-2"></i>
                  Products Management
                </h3>
              </div>
              <div className="card-body">
                {/* Add Product Form */}
                <div className="mb-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="productName" className="form-label">
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                        id="productName"
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                      {validationErrors.name && (
                        <div className="invalid-feedback">
                          {validationErrors.name}
                        </div>
                      )}
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="productPrice" className="form-label">
                        Price ($) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className={`form-control ${validationErrors.price ? 'is-invalid' : ''}`}
                        id="productPrice"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                      />
                      {validationErrors.price && (
                        <div className="invalid-feedback">
                          {validationErrors.price}
                        </div>
                      )}
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="productCategory" className="form-label">
                        Category
                      </label>
                      <select
                        className="form-select"
                        id="productCategory"
                        value={newProduct.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      >
                        <option value="">Select category (optional)</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="productImage" className="form-label">
                        Image URL
                      </label>
                      <input
                        type="url"
                        className={`form-control ${validationErrors.image ? 'is-invalid' : ''}`}
                        id="productImage"
                        placeholder="https://example.com/image.jpg"
                        value={newProduct.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                      />
                      {validationErrors.image && (
                        <div className="invalid-feedback">
                          {validationErrors.image}
                        </div>
                      )}
                    </div>
                    
                    <div className="col-12">
                      <label htmlFor="productDescription" className="form-label">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id="productDescription"
                        rows="3"
                        placeholder="Enter product description (optional)"
                        value={newProduct.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="d-flex col-12 ms-auto">
                      <button 
                        type="button" 
                        className="ms-auto btn btn-success btn-lg"
                        disabled={loading}
                        onClick={handleAddProduct}
                      >
                        <i className="fas fa-plus me-2"></i>
                        {loading ? 'Adding...' : 'Add Product'}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Products List */}
                <hr />
                <h4 className="mb-3">
                  Current Products 
                  <span className="badge bg-secondary ms-2">{products.length}</span>
                </h4>
                
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    No products found. Add your first product above!
                  </div>
                ) : (
                  <div className="row">
                    {products.map(product => (
                      <div key={product._id} className="col-md-6 col-lg-4 mb-3">
                        <div className="card h-100">
                          {product.image && (
                            <img 
                                src={product.image} 
                                className="card-img-top" 
                                alt={product.name}
                                style={{ height: '200px', objectFit: 'cover' }}
                                onError={(e) => {
                                    const fallback = 'https://via.placeholder.com/300x200?text=No+Image';
                                    if (e.target.src !== fallback) {
                                    e.target.src = fallback;
                                    }
                                }}
                                />
                          )}
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="card-text text-success fw-bold fs-5">
                              ${product.price}
                            </p>
                            {product.category && (
                              <span className="badge bg-info mb-2 align-self-start">
                                {product.category}
                              </span>
                            )}
                            {product.description && (
                              <p className="card-text text-muted small">
                                {product.description}
                              </p>
                            )}
                            <div className="mt-auto">
                              <button 
                                onClick={() => handleDeleteProduct(product._id)}
                                className="btn btn-danger btn-sm w-100"
                              >
                                <i className="fas fa-trash me-2"></i>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                <h3 className="card-title mb-0">
                  <i className="fas fa-users me-2"></i>
                  Users <span className="badge bg-light text-dark ms-2">{users.length}</span>
                </h3>
              </div>
              <div className="card-body">
                {users.length === 0 ? (
                  <p className="text-muted">No users found</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {users.map(user => (
                      <div key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <i className="fas fa-user me-2 text-muted"></i>
                          {user.email}
                        </div>
                        {user.isAdmin && (
                          <span className="badge bg-warning text-dark">
                            <i className="fas fa-crown me-1"></i>
                            Admin
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">
                <h3 className="card-title mb-0">
                  <i className="fas fa-shopping-cart me-2"></i>
                  Orders <span className="badge bg-dark ms-2">{orders.length}</span>
                </h3>
              </div>
              <div className="card-body">
                {orders.length === 0 ? (
                  <p className="text-muted">No orders found</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {orders.map(order => (
                      <div key={order._id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <small className="text-muted">Order ID:</small>
                            <br />
                            <code className="small">{order._id}</code>
                          </div>
                          <div className="text-end">
                            <span className={`badge ${
                              order.status === 'completed' ? 'bg-success' :
                              order.status === 'pending' ? 'bg-warning text-dark' :
                              order.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                            }`}>
                              {order.status}
                            </span>
                            {order.totalAmount && (
                              <div className="mt-1">
                                <small className="text-success fw-bold">
                                  ${order.totalAmount}
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Include Font Awesome for icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
    </div>
  );
}