import { baseApi } from '@/api/index.ts';
import { ScheduleParamWithReport } from '@/types/schedule.types.ts';
import { REPORT_TAG } from '@/api/tags.ts';

interface CreateReportRate {
    schedule_param_id: number;
    student_id: number;
    value: string;
}

interface UpdateReportRate {
    report_id: number;
    student_id: number;
    value: string;
}

export const reportApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getReport: build.query<
            ScheduleParamWithReport[],
            { group_id: number; from: string; to: string }
        >({
            query: ({ group_id, from, to }) => ({
                url: `/report/date/${from}-${to}?group_id=${group_id}`,
            }),
            providesTags: [REPORT_TAG],
        }),
        createReportValue: build.mutation<unknown, CreateReportRate>({
            query: (data) => ({
                url: '/report',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: [REPORT_TAG],
        }),
        updateReportValue: build.mutation<unknown, UpdateReportRate>({
            query: (data) => ({
                url: '/report',
                method: 'PATCH',
                data: data,
            }),
            invalidatesTags: [REPORT_TAG],
        }),
        removeReportValue: build.mutation<unknown, number>({
            query: (id) => ({
                url: '/report',
                method: 'DELETE',
                data: { report_id: id },
            }),
            invalidatesTags: [REPORT_TAG],
        }),
    }),
});

export const {
    useGetReportQuery,
    useCreateReportValueMutation,
    useUpdateReportValueMutation,
    useRemoveReportValueMutation,
} = reportApi;
