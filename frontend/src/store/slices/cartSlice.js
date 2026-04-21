import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1/cart';

const getAuthHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth?.user?.token;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : null;
};

export const fetchCart = createAsyncThunk('cart/fetch', async (_, thunkAPI) => {
  try {
    const config = getAuthHeader(thunkAPI);
    if (!config) return { items: [] };
    const res = await axios.get(API_URL, config);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addToCartAPI = createAsyncThunk('cart/add', async (payload, thunkAPI) => {
  try {
    const config = getAuthHeader(thunkAPI);
    if (!config) return thunkAPI.rejectWithValue('Not authenticated');
    const res = await axios.post(API_URL, payload, config);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateCartItemAPI = createAsyncThunk('cart/update', async ({ productId, quantity }, thunkAPI) => {
  try {
    const config = getAuthHeader(thunkAPI);
    const res = await axios.put(`${API_URL}/${productId}`, { quantity }, config);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeFromCartAPI = createAsyncThunk('cart/remove', async (productId, thunkAPI) => {
  try {
    const config = getAuthHeader(thunkAPI);
    const res = await axios.delete(`${API_URL}/${productId}`, config);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const clearCartAPI = createAsyncThunk('cart/clear', async (_, thunkAPI) => {
  try {
    const config = getAuthHeader(thunkAPI);
    await axios.delete(API_URL, config);
    return [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local-only fallback (used when not logged in)
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.isLoading = false;
      // Normalize API cart items to flat structure for UI
      state.items = (action.payload.items || []).map(i => ({
        id: i.product?._id || i.product,
        _id: i.product?._id || i.product,
        name: i.product?.name,
        title: i.product?.title,
        price: i.product?.price,
        image: i.product?.image,
        isVeg: i.product?.isVeg,
        quantity: i.quantity,
        spiceLevel: i.spiceLevel,
        extras: i.extras,
      }));
    };

    builder
      .addCase(fetchCart.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(addToCartAPI.pending, (state) => { state.isLoading = true; })
      .addCase(addToCartAPI.fulfilled, setCart)
      .addCase(addToCartAPI.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(updateCartItemAPI.fulfilled, setCart)
      .addCase(removeFromCartAPI.fulfilled, setCart)
      .addCase(clearCartAPI.fulfilled, (state) => { state.items = []; });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
