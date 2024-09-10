import { useMemo } from 'react';

export const useSelect = <T>(
    data: T[],
    valueKey: keyof T,
    labelKey: keyof T,
): { value: any; label: any }[] => {
    return useMemo(() => {
        return data?.map((item) => ({
            value: item[valueKey],
            label: item[labelKey],
        }));
    }, [data, valueKey, labelKey]);
};
