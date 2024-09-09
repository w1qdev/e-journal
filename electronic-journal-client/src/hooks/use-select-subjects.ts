import { Subject } from '@/types/subject.types.ts';
import { useMemo } from 'react';

export const useSelectSubjects = (subjects: Subject[]) => {
    return useMemo(() => {
        return subjects?.map((item) => ({
            value: item.id,
            label: `${item.slug} ${item.teacher ? ' - ' + item.teacher.fullname : ''}`,
        }));
    }, [subjects]);
};
