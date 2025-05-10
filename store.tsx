// src/store.js (veya store.ts)
import { configureStore } from '@reduxjs/toolkit';

// Reducer'lar henüz oluşturulmadıysa boş bir reducer başlangıç için kullanılabilir
const rootReducer = {
  // Buraya reducer'larınızı ekleyeceksiniz
};

export const store = configureStore({
  reducer: rootReducer,
});

// TypeScript için tip tanımlamaları (eğer TypeScript kullanıyorsanız)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;