import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type Status = 'active' | 'maintenance' | 'inactive';

interface Greenhouse {
  id: number;
  name: string;
  size: number;
  status: Status;
  created_at: string;
  updated_at: string;
}

interface GreenhouseState {
  greenhouses: Greenhouse[];
  selectedGreenhouse: Greenhouse | null;
  loading: boolean;
  error: string | null;
}

const initialState: GreenhouseState = {
  greenhouses: [],
  selectedGreenhouse: null,
  loading: false,
  error: null,
};

export const fetchGreenhouses = createAsyncThunk(
  'greenhouse/fetchGreenhouses',
  async () => {
    try {
      const response = await fetch('http://localhost:8000/api/greenhouses/');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch greenhouses');
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const addGreenhouse = createAsyncThunk(
  'greenhouse/addGreenhouse',
  async (greenhouseData: Partial<Greenhouse>) => {
    try {
      const response = await fetch('http://localhost:8000/api/greenhouses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(greenhouseData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add greenhouse');
      return data;
    } catch (error) {
      throw error;
    }
  }
);

const greenhouseSlice = createSlice({
  name: 'greenhouse',
  initialState,
  reducers: {
    setSelectedGreenhouse: (state, action) => {
      state.selectedGreenhouse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGreenhouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGreenhouses.fulfilled, (state, action) => {
        state.loading = false;
        state.greenhouses = action.payload;
      })
      .addCase(fetchGreenhouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch greenhouses';
      })
      .addCase(addGreenhouse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGreenhouse.fulfilled, (state, action) => {
        state.loading = false;
        state.greenhouses.push(action.payload);
      })
      .addCase(addGreenhouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add greenhouse';
      });
  },
});

export const { setSelectedGreenhouse } = greenhouseSlice.actions;
export default greenhouseSlice.reducer; 