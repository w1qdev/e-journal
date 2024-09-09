import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '@/store/features/user/user.slice.ts';
import { baseApi } from '@/api';
import { themeSlice } from '@/store/features/theme/theme.slice.ts';

export const setupStore = () => {
    return configureStore({
        reducer: {
            [baseApi.reducerPath]: baseApi.reducer,
            user: userSlice.reducer,
            theme: themeSlice.reducer,
        },
        devTools: true,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });
};

export const store = setupStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
