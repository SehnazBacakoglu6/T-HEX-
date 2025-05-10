import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IzinTalebi, IzinTalepDurumu } from '../types';

interface IzinState {
  izinTalepleri: IzinTalebi[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IzinState = {
  izinTalepleri: [],
  isLoading: false,
  error: null
};

export const getIzinTalepleri = createAsyncThunk(
  'izin/getIzinTalepleri',
  async (userId: number, { rejectWithValue }) => {
    try {
      // API entegrasyonu burada yapılacak
      // Şimdilik örnek veri
      return [
        {
          id: 1,
          kullaniciId: userId,
          baslangicTarihi: '2024-06-10',
          bitisTarihi: '2024-06-14',
          gun: 5,
          aciklama: 'Yıllık izin',
          talepTarihi: '2024-05-20',
          durum: IzinTalepDurumu.BEKLIYOR,
          izinTipi: 'Yıllık İzin'
        }
      ];
    } catch (error) {
      return rejectWithValue('İzin talepleri yüklenemedi');
    }
  }
);

export const createIzinTalebi = createAsyncThunk(
  'izin/createIzinTalebi',
  async (izinTalebi: Omit<IzinTalebi, 'id' | 'talepTarihi' | 'durum'>, { rejectWithValue }) => {
    try {
      // API entegrasyonu burada yapılacak
      // Şimdilik örnek dönen veri
      return {
        ...izinTalebi,
        id: Math.floor(Math.random() * 1000),
        talepTarihi: new Date().toISOString(),
        durum: IzinTalepDurumu.BEKLIYOR
      };
    } catch (error) {
      return rejectWithValue('İzin talebi oluşturulamadı');
    }
  }
);

const izinSlice = createSlice({
  name: 'izin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIzinTalepleri.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIzinTalepleri.fulfilled, (state, action: PayloadAction<IzinTalebi[]>) => {
        state.isLoading = false;
        state.izinTalepleri = action.payload;
      })
      .addCase(getIzinTalepleri.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createIzinTalebi.fulfilled, (state, action: PayloadAction<IzinTalebi>) => {
        state.izinTalepleri.push(action.payload);
      });
  }
});

export default izinSlice.reducer;