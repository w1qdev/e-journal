import { Table } from 'antd';
import { ScheduleLesson } from '@/types/schedule.types.ts';
import { FC, useMemo } from 'react';
import { getTeacherScheduleColumns } from '@/components/tables/TeacherScheduleTable/columns.tsx';

interface Props {
    lessons: ScheduleLesson[];
}

export const TeacherScheduleTable: FC<Props> = ({ lessons }) => {
    const dataSource = useMemo(() => {
        return lessons.map((item, index) => ({ key: index, ...item }));
    }, [lessons]);

    return (
        <>
            <Table
                columns={getTeacherScheduleColumns()}
                dataSource={dataSource}
                bordered
                pagination={false}
                size="small"
                scroll={{ x: 500 }}
            />
        </>
    );
};
