import dayjs, { Dayjs } from 'dayjs';

export const formatDate = (date: unknown, format: string = 'DD.MM.YYYY') => {
    if (!date) return null;

    if (typeof date === 'string') {
        return dayjs(date).format(format);
    }

    if (date instanceof Dayjs) {
        return date.format(format);
    }

    return null;
};
