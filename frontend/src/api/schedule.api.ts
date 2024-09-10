import { baseApi } from '@/api/index.ts';
import {
    GroupSchedule,
    Schedule,
    ScheduleWithParams,
    TeacherSchedule,
} from '@/types/schedule.types.ts';
import { SCHEDULE_PARAM_TAG, SCHEDULE_TAG } from '@/api/tags.ts';

interface CreateGroup {
    date: string;
}

interface UpdateGroup extends CreateGroup {
    schedule_id: number;
}

interface ChangeVisibility {
    schedule_id: number;
    visible: boolean;
}

export const scheduleApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getSchedules: build.query<Schedule[], null>({
            query: () => ({
                url: '/schedule',
            }),
            providesTags: [SCHEDULE_TAG],
        }),
        getScheduleById: build.query<ScheduleWithParams, number>({
            query: (id) => ({
                url: '/schedule/' + id,
            }),
            providesTags: [SCHEDULE_PARAM_TAG],
        }),
        getSchedulesByGroup: build.query<GroupSchedule, number>({
            query: (id) => ({
                url: '/schedule/group/' + id,
            }),
        }),
        getSchedulesByDate: build.query<TeacherSchedule, { from: string; to: string }>({
            query: ({ from, to }) => ({
                url: `/schedule/date/${from}-${to}`,
            }),
        }),
        createSchedule: build.mutation<Schedule, CreateGroup>({
            query: (data) => ({
                url: '/schedule',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: [SCHEDULE_TAG],
        }),
        updateSchedule: build.mutation<Schedule, UpdateGroup>({
            query: (data) => ({
                url: '/schedule',
                method: 'PATCH',
                data: data,
            }),
            invalidatesTags: [SCHEDULE_TAG],
        }),
        removeSchedule: build.mutation<undefined, number>({
            query: (id) => ({
                url: '/schedule',
                method: 'DELETE',
                data: {
                    schedule_id: id,
                },
            }),
            invalidatesTags: [SCHEDULE_TAG],
        }),
        changeScheduleVisibility: build.mutation<undefined, ChangeVisibility>({
            query: (data) => ({
                url: '/schedule/change_visibility',
                method: 'PATCH',
                data: data,
            }),
            invalidatesTags: [SCHEDULE_TAG],
        }),
    }),
});

export const {
    useGetSchedulesQuery,
    useGetScheduleByIdQuery,
    useGetSchedulesByGroupQuery,
    useGetSchedulesByDateQuery,
    useCreateScheduleMutation,
    useUpdateScheduleMutation,
    useRemoveScheduleMutation,
    useChangeScheduleVisibilityMutation,
} = scheduleApi;
