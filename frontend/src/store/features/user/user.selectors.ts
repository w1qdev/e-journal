import { RootState } from '@/store/store.ts';

export const selectIsAuth = (state: RootState) => state.user.isAuth;
export const selectUserRole = (state: RootState) => state.user.user?.role;
export const selectUser = (state: RootState) => state.user.user;
