import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import greenhouseReducer from './slices/greenhouseSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    greenhouse: greenhouseReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 