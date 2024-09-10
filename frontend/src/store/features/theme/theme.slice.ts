import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '@/types/theme.types.ts';
import { loadTheme } from './lib/load-theme.ts';
import { setTheme } from './lib/set-theme.ts';
import { loadCompact } from '@/store/features/theme/lib/load-compact.ts';
import { setCompact } from '@/store/features/theme/lib/set-compact.ts';

interface ThemeSliceState {
    theme: Theme;
    compact: boolean;
}

const initialState: ThemeSliceState = {
    theme: loadTheme(),
    compact: loadCompact(),
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeSliceState['theme']>) => {
            setTheme(action.payload);
            state.theme = action.payload;
        },
        setCompact: (state, action: PayloadAction<ThemeSliceState['compact']>) => {
            setCompact(action.payload);
            state.compact = action.payload;
        },
    },
});

export const themeActions = themeSlice.actions;
