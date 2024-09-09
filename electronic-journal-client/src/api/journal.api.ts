import { baseApi } from '@/api/index.ts';
import { ScheduleParamWithJournal } from '@/types/schedule.types.ts';
import { JOURNAL_TAG, SCHEDULE_PARAM_TAG } from '@/api/tags.ts';

interface GetJournalData {
    group_id: number;
    subject_id: number;
    lesson_type: 'ALL' | 'PRACTICE' | 'LECTURE' | 'LAB_WORK' | 'SELF_WORK';
}

interface CreateJournalRate {
    schedule_param_id: number;
    student_id: number;
    rate: string;
}

interface UpdateJournalRate {
    journal_id: number;
    student_id: number;
    rate: string;
}

export const journalApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getJournal: build.query<ScheduleParamWithJournal[], GetJournalData>({
            query: ({ group_id, subject_id, lesson_type }) => ({
                url: `/journal?group_id=${group_id}&subject_id=${subject_id}&lesson_type=${lesson_type}`,
            }),
            providesTags: [JOURNAL_TAG, SCHEDULE_PARAM_TAG],
        }),
        createJournalRate: build.mutation<unknown, CreateJournalRate>({
            query: (data) => ({
                url: '/journal',
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: [JOURNAL_TAG],
        }),
        updateJournalRate: build.mutation<unknown, UpdateJournalRate>({
            query: (data) => ({
                url: '/journal',
                method: 'PATCH',
                data: data,
            }),
            invalidatesTags: [JOURNAL_TAG],
        }),
        removeJournalRate: build.mutation<unknown, number>({
            query: (id) => ({
                url: '/journal',
                method: 'DELETE',
                data: { journal_id: id },
            }),
            invalidatesTags: [JOURNAL_TAG],
        }),
    }),
});

export const {
    useGetJournalQuery,
    useCreateJournalRateMutation,
    useUpdateJournalRateMutation,
    useRemoveJournalRateMutation,
} = journalApi;
