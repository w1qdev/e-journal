import { baseApi } from '@/api/index.ts';
import { ScheduleParam } from '@/types/schedule.types.ts';
import { SCHEDULE_PARAM_TAG } from '@/api/tags.ts';

interface CreateParam {
    schedule_id: number;
    group_id: number;
    sub_group: string | null;
    subject_id: number;
    first_half: string | null;
    number: number;
    office?: number;
}

interface UpdateParam {
    param_id: number;
    subject_id: number;
    office?: number;
    sub_group: string | null;
    first_half: string | null;
    lesson_type: string | null;
    lesson_code: string | null;
    homework: string | null;
    topic: string | null;
    end_date: string | null;
}

interface CreateCertification {
    schedule_id: number;
    group_id: number;
    subject_id: number;
    certification_period: string;
}

export const scheduleParamApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createScheduleParam: build.mutation<ScheduleParam, CreateParam>({
            query: (data) => ({
                url: '/schedule_param',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: [SCHEDULE_PARAM_TAG],
        }),
        updateScheduleParam: build.mutation<ScheduleParam, UpdateParam>({
            query: (data) => ({
                url: '/schedule_param',
                method: 'PATCH',
                data: data,
            }),
            invalidatesTags: [SCHEDULE_PARAM_TAG],
        }),
        removeScheduleParam: build.mutation<undefined, number>({
            query: (param_id) => ({
                url: '/schedule_param',
                method: 'DELETE',
                data: { param_id },
            }),
            invalidatesTags: [SCHEDULE_PARAM_TAG],
        }),
        addCertification: build.mutation<ScheduleParam, CreateCertification>({
            query: (data) => ({
                url: '/schedule_param/certification',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: [SCHEDULE_PARAM_TAG],
        }),
    }),
});

export const {
    useCreateScheduleParamMutation,
    useUpdateScheduleParamMutation,
    useRemoveScheduleParamMutation,
    useAddCertificationMutation,
} = scheduleParamApi;
