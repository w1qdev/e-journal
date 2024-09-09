import { baseApi } from '@/api/index.ts';
import { User } from '@/types/user.types.ts';
import { RoleSlugs } from '@/types/role.types.ts';
import { USER_TAG } from '@/api/tags.ts';

interface UserData {
    username: string;
    password: string;
}

interface CreateUser {
    last_name: string;
    first_name: string;
    surname?: string;
    email: string;
    role_id: number;
    group_id?: number;
}

interface UpdateUser {
    user_id: number;
    lastname: string;
    firstname: string;
    surname?: string;
    email: string;
    role_id: number;
    group_id?: number;
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<User[], null>({
            query: () => ({
                url: '/user',
            }),
            providesTags: [USER_TAG],
        }),
        getUsersByRoles: build.query<User[], RoleSlugs[]>({
            query: (slugs) => ({
                url: '/user/role?' + slugs.map((i) => `slug=${i}`).join('&'),
            }),
        }),
        getUsersByGroup: build.query<User[], number>({
            query: (id) => ({
                url: '/user/group/' + id,
            }),
        }),
        checkout: build.query<User, null>({
            query: () => ({
                url: '/user/checkout',
            }),
            extraOptions: { showErrorNotification: false },
        }),
        login: build.mutation<User, UserData>({
            query: ({ username, password }) => ({
                url: '/user/login',
                method: 'POST',
                data: { username, password },
            }),
        }),
        logout: build.mutation({
            query: () => ({
                url: '/user/logout',
                method: 'POST',
            }),
        }),
        createUser: build.mutation<User & { password: string }, CreateUser>({
            query: (data) => ({
                url: '/user',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: [USER_TAG],
        }),
        updateUser: build.mutation<User, UpdateUser>({
            query: (data) => ({
                url: '/user',
                method: 'PATCH',
                data: data,
            }),
            invalidatesTags: [USER_TAG],
        }),
        removeUser: build.mutation<undefined, number>({
            query: (id) => ({
                url: '/user',
                method: 'DELETE',
                data: {
                    user_id: id,
                },
            }),
            invalidatesTags: [USER_TAG],
        }),
        resetUserPassword: build.mutation<{ password: string }, number>({
            query: (user_id) => ({
                url: '/user/change_password',
                method: 'PATCH',
                data: { user_id },
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUsersByRolesQuery,
    useGetUsersByGroupQuery,
    useCheckoutQuery,
    useLoginMutation,
    useLogoutMutation,
    useCreateUserMutation,
    useUpdateUserMutation,
    useRemoveUserMutation,
    useResetUserPasswordMutation,
} = userApi;
