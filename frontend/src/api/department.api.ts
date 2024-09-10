import { baseApi } from '@/api/index.ts';
import { DEPARTMENT_TAG } from '@/api/tags.ts';
import { Department } from '@/types/department.types.ts';

interface CreateDepartment {
    name: string;
    president_id: number;
}

interface UpdateDepartment extends CreateDepartment {
    department_id: number;
}

export const departmentApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getDepartments: build.query<Department[], null>({
            query: () => ({
                url: '/department',
            }),
            providesTags: [DEPARTMENT_TAG],
        }),
        createDepartment: build.mutation<Department, CreateDepartment>({
            query: (data) => ({
                url: '/department',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: [DEPARTMENT_TAG],
        }),
        updateDepartment: build.mutation<Department, UpdateDepartment>({
            query: (data) => ({
                url: '/department',
                method: 'PATCH',
                data: data,
            }),
            invalidatesTags: [DEPARTMENT_TAG],
        }),
        removeDepartment: build.mutation<undefined, number>({
            query: (id) => ({
                url: '/department',
                method: 'DELETE',
                data: {
                    department_id: id,
                },
            }),
            invalidatesTags: [DEPARTMENT_TAG],
        }),
    }),
});

export const {
    useGetDepartmentsQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useRemoveDepartmentMutation,
} = departmentApi;
