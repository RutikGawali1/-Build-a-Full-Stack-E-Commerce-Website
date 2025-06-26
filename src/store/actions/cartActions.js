export const CART_REQUEST = 'CART_REQUEST';
export const CART_SUCCESS = 'CART_SUCCESS';
export const CART_FAIL = 'CART_FAIL';
export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';
export const CART_UPDATE_QUANTITY = 'CART_UPDATE_QUANTITY';
export const CART_CLEAR = 'CART_CLEAR';

const token = localStorage.getItem('token');

// 1️⃣ Fetch Cart
export const fetchCart = () => async (dispatch) => {
  dispatch({ type: CART_REQUEST });
  try {
    if (!token) throw new Error('Authentication token not found');

    const response = await fetch(`http://localhost:5000/api/cart/getCart`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', token }
    });

    if (!response.ok) throw new Error((await response.json()).message);

    const data = await response.json();
    dispatch({ type: CART_SUCCESS, payload: data.items || [] });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error.message });
  }
};

// 2️⃣ Add to Cart
export const addToCart = (product, quantity = 1) => async (dispatch) => {
  dispatch({ type: CART_REQUEST });
  try {
    if (!token) throw new Error('Authentication token not found');

    const response = await fetch(`http://localhost:5000/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token },
      body: JSON.stringify({ productId: product._id, quantity })
    });

    if (!response.ok) throw new Error((await response.json()).message);

    const data = await response.json();
    dispatch({ type: CART_SUCCESS, payload: data.items || [] });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error.message });
  }
};

// 3️⃣ Update Cart Quantity
export const updateCartQuantity = (productId, quantity) => async (dispatch) => {
  dispatch({ type: CART_REQUEST });
  try {
    if (!token) throw new Error('Authentication token not found');

    if (quantity <= 0) return dispatch(removeFromCart(productId));

    const response = await fetch(`http://localhost:5000/api/cart/update-quantity`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', token },
      body: JSON.stringify({ productId, quantity })
    });

    if (!response.ok) throw new Error((await response.json()).message);

    const data = await response.json();
    dispatch({ type: CART_SUCCESS, payload: data.items || [] });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error.message });
  }
};

// 4️⃣ Remove Item from Cart (Fixed to update full cart)
export const removeFromCart = (productId) => async (dispatch) => {
  dispatch({ type: CART_REQUEST });
  try {
    if (!token) throw new Error('Authentication token not found');

    const response = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', token }
    });

    if (!response.ok) throw new Error((await response.json()).message);

    const data = await response.json(); // Contains updated cart
    dispatch({ type: CART_SUCCESS, payload: data.items || [] });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error.message });
  }
};

// 5️⃣ Clear Entire Cart
export const clearCart = () => async (dispatch) => {
  dispatch({ type: CART_REQUEST });
  try {
    if (!token) throw new Error('Authentication token not found');

    const response = await fetch(`http://localhost:5000/api/cart/clear`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', token }
    });

    if (!response.ok) throw new Error((await response.json()).message);

    dispatch({ type: CART_CLEAR });
  } catch (error) {
    dispatch({ type: CART_FAIL, payload: error.message });
  }
};

// 6️⃣ Sync
export const syncCart = () => async (dispatch) => {
  dispatch(fetchCart());
};
