import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/axios.ts';
import {
    DEPARTMENT_TAG,
    GROUP_TAG,
    JOURNAL_TAG,
    PROFESSION_TAG,
    REPORT_TAG,
    SCHEDULE_PARAM_TAG,
    SCHEDULE_TAG,
    SUBJECT_TAG,
    USER_TAG,
} from '@/api/tags.ts';

export const baseApi = createApi({
    tagTypes: [
        SUBJECT_TAG,
        GROUP_TAG,
        USER_TAG,
        DEPARTMENT_TAG,
        PROFESSION_TAG,
        SCHEDULE_TAG,
        SCHEDULE_PARAM_TAG,
        JOURNAL_TAG,
        REPORT_TAG,
    ],
    reducerPath: 'api',
    baseQuery: axiosBaseQuery(),
    endpoints: () => ({}),
});
