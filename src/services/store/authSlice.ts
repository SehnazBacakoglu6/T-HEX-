import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // API entegrasyonu burada yapılacak
      // Şimdilik basit bir simülasyon
      return { 
        user: { 
          id: 1, 
          ad: 'Test', 
          soyad: 'Kullanıcı',
          departman: 'Mühendislik',
          pozisyon: 'Yazılım Mühendisi',
          iseGirisTarihi: '2020-01-15',
          kalanIzinHakki: 14,
          email 
        }, 
        token: 'test-token' 
      };
    } catch (error) {
      return rejectWithValue('Giriş başarısız');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    return true;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Token'ı AsyncStorage'a kaydet
        AsyncStorage.setItem('token', action.payload.token);
        AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  }
});

export default authSlice.reducer;