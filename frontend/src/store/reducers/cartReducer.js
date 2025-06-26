import { 
  CART_REQUEST, 
  CART_SUCCESS, 
  CART_FAIL, 
  CART_CLEAR 
} from '../actions/cartActions';

const initialState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0
};

const calculateTotals = (items) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => {
    const price = item.product?.price || item.price || 0;
    return total + (price * item.quantity);
  }, 0);
  
  return {
    totalItems,
    totalPrice: totalPrice.toFixed(2)
  };
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case CART_SUCCESS:
      const { totalItems, totalPrice } = calculateTotals(action.payload);
      return {
        ...state,
        loading: false,
        items: action.payload,
        totalItems,
        totalPrice,
        error: null
      };
    
    case CART_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case CART_CLEAR:
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    
    default:
      return state;
  }
};

export default cartReducer;