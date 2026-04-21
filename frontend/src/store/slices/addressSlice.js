import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1/addresses';

const authHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth?.user?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchAddresses = createAsyncThunk('addresses/fetch', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, authHeader(thunkAPI));
    return res.data;
  } catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

export const addAddress = createAsyncThunk('addresses/add', async (data, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, data, authHeader(thunkAPI));
    return res.data;
  } catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

export const updateAddress = createAsyncThunk('addresses/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, authHeader(thunkAPI));
    return res.data;
  } catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

export const deleteAddress = createAsyncThunk('addresses/delete', async (id, thunkAPI) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, authHeader(thunkAPI));
    return res.data;
  } catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

export const setDefaultAddress = createAsyncThunk('addresses/setDefault', async (id, thunkAPI) => {
  try {
    const res = await axios.patch(`${API_URL}/${id}/default`, {}, authHeader(thunkAPI));
    return res.data;
  } catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

const addressSlice = createSlice({
  name: 'addresses',
  initialState: { list: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    const setList = (state, action) => { state.isLoading = false; state.list = action.payload; };
    builder
      .addCase(fetchAddresses.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAddresses.fulfilled, setList)
      .addCase(fetchAddresses.rejected, (state, a) => { state.isLoading = false; state.error = a.payload; })
      .addCase(addAddress.fulfilled, setList)
      .addCase(updateAddress.fulfilled, setList)
      .addCase(deleteAddress.fulfilled, setList)
      .addCase(setDefaultAddress.fulfilled, setList);
  },
});

export default addressSlice.reducer;
