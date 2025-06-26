import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartQuantity, removeFromCart, clearCart } from '../store/actions/cartActions';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, totalItems, totalPrice } = useSelector((state) => state.cart);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartQuantity(productId, newQuantity));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">
        <i className="fas fa-shopping-bag me-2"></i>
        Your Shopping Cart
        {totalItems > 0 && (
          <span className="badge bg-primary text-white ms-2">{totalItems}</span>
        )}
      </h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-shopping-bag fa-4x text-muted mb-3"></i>
          <h5 className="text-muted">Your cart is empty</h5>
          <p className="text-muted small">Add some products to get started!</p>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            {items.map((item) => (
              <div key={item._id} className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="row align-items-center">
                      {/* Product Image */}
                      <div className="col-md-2 col-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ objectFit: 'cover', height: '60px', width: '60px' }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="col-md-6 col-9">
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="text-muted small mb-0">${item.price} each</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-md-2 d-flex justify-content-center my-2 my-md-0">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" disabled>
                            {item.quantity}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>

                      {/* Total & Remove */}
                      <div className="col-md-2 text-end">
                        <p className="mb-1 fw-bold text-primary">${(item.price * item.quantity)}</p>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="row">
            <div className="col-md-6 offset-md-6">
              <div className="card p-4 shadow-sm">
                <h5 className="mb-3">Cart Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Items:</span>
                  <strong>{totalItems}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Total Price:</span>
                  <strong className="text-primary">${totalPrice}</strong>
                </div>
                <button className="btn btn-success w-100 mb-2">
                  <i className="fas fa-credit-card me-2"></i>
                  Proceed to Checkout
                </button>
                <button className="btn btn-outline-danger w-100" onClick={handleClearCart}>
                  <i className="fas fa-trash me-2"></i>
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
