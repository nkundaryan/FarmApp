import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type Status = 'active' | 'maintenance' | 'inactive';

export interface Greenhouse {
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
  'greenhouses/fetchAll',
  async () => {
    const response = await fetch('http://localhost:8000/api/greenhouses/');
    if (!response.ok) {
      throw new Error('Failed to fetch greenhouses');
    }
    return response.json();
  }
);

export const addGreenhouse = createAsyncThunk(
  'greenhouses/add',
  async (greenhouse: Omit<Greenhouse, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await fetch('http://localhost:8000/api/greenhouses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(greenhouse),
    });
    if (!response.ok) {
      throw new Error('Failed to add greenhouse');
    }
    return response.json();
  }
);

export const updateGreenhouseStatus = createAsyncThunk(
  'greenhouses/updateStatus',
  async ({ id, status }: { id: number; status: Status }) => {
    const response = await fetch(`http://localhost:8000/api/greenhouses/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update greenhouse status');
    }
    return response.json();
  }
);

const greenhouseSlice = createSlice({
  name: 'greenhouses',
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
      .addCase(addGreenhouse.fulfilled, (state, action) => {
        state.greenhouses.push(action.payload);
      })
      .addCase(updateGreenhouseStatus.fulfilled, (state, action) => {
        const index = state.greenhouses.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.greenhouses[index] = action.payload;
        }
      });
  },
});

export const { setSelectedGreenhouse } = greenhouseSlice.actions;
export default greenhouseSlice.reducer; 