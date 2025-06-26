import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/actions/cartActions';

const ProductCard = React.memo(({ product }) => {
  const dispatch = useDispatch();
  const { items: cartItems, loading } = useSelector((state) => state.cart);
  const [isAdding, setIsAdding] = useState(false);

  const cartItem = useMemo(() => {
    return cartItems.find(item => {
      const productId = item.product?._id || item.productId;
      return productId === product._id;
    });
  }, [cartItems, product._id]);

  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = useCallback(async () => {
    if (isAdding || loading) return;

    setIsAdding(true);
    try {
      await dispatch(addToCart(product, 1));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  }, [dispatch, product, isAdding, loading]);

  const handleImageError = useCallback((e) => {
    e.target.src = 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400';
  }, []);

  const productName = product.name || product.title || 'Unnamed Product';
  const productPrice = product.price || '0.00';
  const productImage = product.image || product.imageUrl || 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400';

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="position-relative overflow-hidden">
        <img
          src={productImage}
          alt={productName}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
          onError={handleImageError}
        />
        {cartQuantity > 0 && (
          <span className="badge bg-success position-absolute top-0 end-0 m-2">
            In Cart: {cartQuantity}
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{productName}</h5>

        {product.description && (
          <p className="card-text text-muted small text-truncate" style={{ maxHeight: '3em' }}>
            {product.description}
          </p>
        )}

        <div className="d-flex justify-content-between align-items-center mt-auto mb-3">
          <span className="fw-bold fs-5 text-primary">${productPrice}</span>
          {product.category && (
            <span className="badge bg-light text-dark border">{product.category}</span>
          )}
        </div>

        <button
          className={`btn w-100 d-flex align-items-center justify-content-center ${
            cartQuantity > 0 ? 'btn-success' : 'btn-primary'
          } ${loading || isAdding ? 'disabled opacity-75' : ''}`}
          onClick={handleAddToCart}
          disabled={loading || isAdding}
        >
          {isAdding ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Adding...
            </>
          ) : cartQuantity > 0 ? (
            <>
              <i className="bi bi-plus-circle me-2"></i> Add More ({cartQuantity})
            </>
          ) : (
            <>
              <i className="bi bi-cart-plus me-2"></i> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
