import { RootState } from '@/store/store.ts';

export const selectTheme = (state: RootState) => state.theme.theme;
export const selectCompact = (state: RootState) => state.theme.compact;
