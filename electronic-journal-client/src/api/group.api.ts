import { baseApi } from '@/api/index.ts';
import { Group } from '@/types/group.types.ts';
import { Subject } from '@/types/subject.types.ts';
import { GROUP_TAG } from '@/api/tags.ts';

interface CreateGroup {
    name: string;
    course: number;
    profession_id: number;
    tutor_id: number;
}

interface UpdateGroup extends CreateGroup {
    group_id: number;
}

interface GroupSubject {
    group_id: number;
    subject_id: number;
}

export const groupApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getGroups: build.query<Group[], null>({
            query: () => ({
                url: '/group',
            }),
            providesTags: [GROUP_TAG],
        }),
        getGroupById: build.query<Group, number>({
            query: (id) => ({
                url: '/group/' + id,
            }),
        }),
        createGroup: build.mutation<Subject, CreateGroup>({
            query: (data) => ({
                url: '/group',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: [GROUP_TAG],
        }),
        updateGroup: build.mutation<Subject, UpdateGroup>({
            query: (data) => ({
                url: '/group',
                method: 'PATCH',
                data: data,
            }),
            invalidatesTags: [GROUP_TAG],
        }),
        removeGroup: build.mutation<undefined, number>({
            query: (id) => ({
                url: '/group',
                method: 'DELETE',
                data: {
                    group_id: id,
                },
            }),
            invalidatesTags: [GROUP_TAG],
        }),
        addGroupSubject: build.mutation<undefined, GroupSubject>({
            query: (data) => ({
                url: '/group_subject',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: [GROUP_TAG],
        }),
        removeGroupSubject: build.mutation<undefined, GroupSubject>({
            query: (data) => ({
                url: '/group_subject',
                method: 'DELETE',
                data: data,
            }),
            invalidatesTags: [GROUP_TAG],
        }),
    }),
});

export const {
    useGetGroupsQuery,
    useGetGroupByIdQuery,
    useCreateGroupMutation,
    useUpdateGroupMutation,
    useRemoveGroupMutation,
    useAddGroupSubjectMutation,
    useRemoveGroupSubjectMutation,
} = groupApi;
