import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LeaveState {
    leaves: any[];
    loading: boolean;
    error: string | null;
}

const initialState: LeaveState = {
    leaves: [],
    loading: false,
    error: null,
};

const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {
        setLeaves: (state, action: PayloadAction<any[]>) => {
            state.leaves = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setLeaves, setLoading, setError } = leaveSlice.actions;
export default leaveSlice.reducer; 