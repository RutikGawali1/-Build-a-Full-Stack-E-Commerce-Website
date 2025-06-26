export const CART_REQUEST = 'CART_REQUEST';
export const CART_SUCCESS = 'CART_SUCCESS';
export const CART_FAIL = 'CART_FAIL';
export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';
export const CART_UPDATE_QUANTITY = 'CART_UPDATE_QUANTITY';
export const CART_CLEAR = 'CART_CLEAR';

const token = localStorage.getItem('token');

export const fetchCart = () => async (dispatch) => {
  dispatch({ type: CART_REQUEST });
  try {
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`http://localhost:5000/api/cart/getCart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    dispatch({ type: CART_SUCCESS, payload: data.items || [] });
  } catch (error) {
    console.error('Fetch cart error:', error);
    dispatch({ type: CART_FAIL, payload: error.message });
  }
};

export const addToCart = (product, quantity = 1) => async (dispatch) => {
  dispatch({ type: CART_REQUEST });
  try {
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`http://localhost:5000/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        productId: product._id,
        quantity: quantity
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    const cartItem = { ...product, quantity };
    dispatch({ type: CART_ADD_ITEM, payload: cartItem });
    
    dispatch({ type: CART_SUCCESS, payload: data.items || [] });
  } catch (error) {
    console.error('Add to cart error:', error);
    dispatch({ type: CART_FAIL, payload: error.message });
  }
};

export const updateCartQuantity = (productId, quantity) => async (dispatch) => {
  dispatch({ type: CART_REQUEST });
  try {
    if (!token) {
      throw new Error('Authentication token not found');
    }

    if (quantity <= 0) {
      return dispatch(removeFromCart(productId));
    }
    
    const response = await fetch(`http://localhost:5000/api/cart/update-quantity`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        productId,
        quantity
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    // Update local state
    dispatch({ type: CART_UPDATE_QUANTITY, payload: { productId, quantity } });
    
    // Optionally dispatch success with full cart data
    dispatch({ type: CART_SUCCESS, payload: data.items || [] });
  } catch (error) {
    console.error('Update cart quantity error:', error);
    dispatch({ type: CART_FAIL, payload: error.message });
  }
};

export const removeFromCart = (productId) => async (dispatch) => {
  dispatch({ type: CART_REQUEST });
  try {
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    dispatch({ type: CART_REMOVE_ITEM, payload: productId });
  } catch (error) {
    console.error('Remove from cart error:', error);
    dispatch({ type: CART_FAIL, payload: error.message });
  }
};

export const clearCart = () => async (dispatch) => {
  dispatch({ type: CART_REQUEST });
  try {
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`http://localhost:5000/api/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    dispatch({ type: CART_CLEAR });
  } catch (error) {
    console.error('Clear cart error:', error);
    dispatch({ type: CART_FAIL, payload: error.message });
  }
};

// Utility action to sync cart with server
export const syncCart = () => async (dispatch) => {
  dispatch(fetchCart());
};