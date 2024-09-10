import { baseApi } from '@/api/index.ts';
import { PROFESSION_TAG } from '@/api/tags.ts';
import { Profession } from '@/types/profession.types.ts';

interface CreateProfession {
    name: string;
    slug: string;
}

interface UpdateProfession extends CreateProfession {
    profession_id: number;
}

export const professionApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getProfessions: build.query<Profession[], null>({
            query: () => ({
                url: '/profession',
            }),
            providesTags: [PROFESSION_TAG],
        }),
        createProfession: build.mutation<Profession, CreateProfession>({
            query: (data) => ({
                url: '/profession',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: [PROFESSION_TAG],
        }),
        updateProfession: build.mutation<Profession, UpdateProfession>({
            query: (data) => ({
                url: '/profession',
                method: 'PATCH',
                data: data,
            }),
            invalidatesTags: [PROFESSION_TAG],
        }),
        removeProfession: build.mutation<undefined, number>({
            query: (id) => ({
                url: '/profession',
                method: 'DELETE',
                data: {
                    profession_id: id,
                },
            }),
            invalidatesTags: [PROFESSION_TAG],
        }),
    }),
});

export const {
    useGetProfessionsQuery,
    useCreateProfessionMutation,
    useUpdateProfessionMutation,
    useRemoveProfessionMutation,
} = professionApi;
