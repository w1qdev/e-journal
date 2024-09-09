import { Table } from 'antd';
import { ScheduleLesson } from '@/types/schedule.types.ts';
import { FC, useMemo } from 'react';
import { getStudentScheduleColumns } from '@/components/tables/StudentScheduleTable/columns.tsx';

interface Props {
    lessons: ScheduleLesson[];
}

export const StudentScheduleTable: FC<Props> = ({ lessons }) => {
    const dataSource = useMemo(() => {
        return lessons.map((item, index) => ({ key: index, ...item }));
    }, [lessons]);

    return (
        <>
            <Table
                columns={getStudentScheduleColumns()}
                dataSource={dataSource}
                bordered
                pagination={false}
                size="small"
                scroll={{ x: 500 }}
            />
        </>
    );
};
