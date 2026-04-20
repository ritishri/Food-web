import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1/products';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ category, isVeg }, thunkAPI) => {
    try {
      let url = `${API_URL}?category=${category}`;
      if (isVeg !== undefined) {
        url += `&isVeg=${isVeg}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(API_URL, productData, config);
      return response.data;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(`${API_URL}/${id}`, productData, config);
      return response.data;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  singleProduct: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // FetchByCategory
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.items = [];
      })
      // FetchAll
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // FetchDetails
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.singleProduct = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.singleProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.singleProduct = null;
      })
      // Create
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
