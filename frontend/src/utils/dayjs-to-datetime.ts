import { Dayjs } from 'dayjs';

export const dayjsToDatetime = (date: Dayjs) => {
    return date.format('YYYY-MM-DDTHH:mm:ss');
};
