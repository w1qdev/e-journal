import { baseApi } from '@/api/index.ts';
import { Role } from '@/types/role.types.ts';

export const roleApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getRoles: build.query<Role[], null>({
            query: () => ({
                url: '/role',
            }),
        }),
    }),
});

export const { useGetRolesQuery } = roleApi;
