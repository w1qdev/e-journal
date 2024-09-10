import { ColumnsType } from 'antd/es/table';
import { ScheduleLesson } from '@/types/schedule.types.ts';

export const getStudentScheduleColumns = () => {
    return [
        {
            key: 'number',
            render: (_, record) => <span style={{ textAlign: 'center' }}>{record.key + 1}</span>,
            title: '№',
            width: 1,
        },
        {
            key: 'time',
            render: (_, record) => <span style={{ whiteSpace: 'nowrap' }}>{record.time}</span>,
            title: 'Время',
            width: 1,
        },
        {
            key: 'name',
            render: (_, record) => {
                if (!record.name) return null;
                const names = record.name.split('/\n');
                return names.map((name) => <div>{name}</div>);
            },
            title: 'Пара',
        },
        {
            key: 'office',
            render: (_, record) => {
                if (!record.office) return null;
                const cabinets = record.office.split('/');
                return cabinets.map((cabinet) => <div>{cabinet}</div>);
            },
            title: 'Кабинет',
        },
    ] as ColumnsType<ScheduleLesson & { key: number }>;
};
