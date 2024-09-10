import { baseApi } from '@/api/index.ts';
import { Subject } from '@/types/subject.types.ts';
import { SUBJECT_TAG } from '@/api/tags.ts';

interface CreateSubject {
    name: string;
    slug: string;
    code: string;
    teacher_id?: number;
}

interface UpdateSubject extends CreateSubject {
    subject_id: number;
}

export const subjectApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getSubjects: build.query<Subject[], null>({
            query: () => ({
                url: '/subject',
            }),
            providesTags: [SUBJECT_TAG],
        }),
        getSubjectById: build.query<Subject, number>({
            query: (id) => ({
                url: '/subject/' + id,
            }),
        }),
        createSubject: build.mutation<Subject, CreateSubject>({
            query: (data) => ({
                url: '/subject',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: [SUBJECT_TAG],
        }),
        updateSubject: build.mutation<Subject, UpdateSubject>({
            query: (data) => ({
                url: '/subject',
                method: 'PATCH',
                data: data,
            }),
            invalidatesTags: [SUBJECT_TAG],
        }),
        removeSubject: build.mutation<undefined, number>({
            query: (id) => ({
                url: '/subject',
                method: 'DELETE',
                data: {
                    subject_id: id,
                },
            }),
            invalidatesTags: [SUBJECT_TAG],
        }),
    }),
});

export const {
    useGetSubjectsQuery,
    useGetSubjectByIdQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useRemoveSubjectMutation,
} = subjectApi;
