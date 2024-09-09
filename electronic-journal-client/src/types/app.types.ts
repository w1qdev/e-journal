import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

export interface ThunkAPI<RejectType> {
    dispatch: ThunkDispatch<unknown, unknown, UnknownAction>;
    rejectWithValue: (value: string) => RejectType;
}

export interface QueryExtraOptions {
    showErrorNotification?: boolean;

    [key: string]: unknown;
}
