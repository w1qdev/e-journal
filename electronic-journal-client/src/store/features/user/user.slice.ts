import { createSlice } from '@reduxjs/toolkit';
import { User } from '@/types/user.types.ts';
import { userApi } from '@/api/user.api.ts';

interface UserSliceState {
    isAuth: boolean;
    user?: User;
}

const initialState: UserSliceState = {
    isAuth: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(userApi.endpoints.checkout.matchFulfilled, (state, action) => {
            state.isAuth = true;
            state.user = action.payload;
        });

        builder.addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
            state.isAuth = true;
            state.user = action.payload;
        });

        builder.addMatcher(userApi.endpoints.logout.matchFulfilled, () => initialState);
    },
});

export const userActions = { ...userSlice.actions };
