import { ScheduleParamWithReport } from '@/types/schedule.types.ts';
import { User } from '@/types/user.types.ts';
import { ColumnsType } from 'antd/es/table';
import { formatDate } from '@/utils/format-date.ts';
import { Tooltip } from 'antd';

export interface ReportTableData {
    key: number;
    student: User;
    [key: number]: string | null;
}

type ColumnsTypes<Item> = (ColumnsType<Item>[number] & {
    dataIndex: string;
    children?: ColumnsTypes<Item>;
})[];

export type ReportTableColumnsType = ColumnsTypes<ReportTableData>[number];

export const getReportColumns = (params: ScheduleParamWithReport[]) => {
    const dates = params.reduce((acc, param) => acc.add(param.schedule.date), new Set<string>());

    return [
        {
            key: 'student',
            render: (_, record) => record.student.full_name,
            title: 'Студент',
            fixed: window.innerWidth > 1000 ? 'left' : undefined,
            width: 300,
        },
        ...Array.from(dates).map((date) => ({
            title: formatDate(date),
            children: params
                .filter((param) => param.schedule.date === date)
                .map((param) => ({
                    key: param.id,
                    dataIndex: param.id,
                    title: (
                        <Tooltip title={param.subject.teacher?.fullname}>
                            {param.subject.slug}
                        </Tooltip>
                    ),
                    width: 150,
                })),
        })),
    ] as ColumnsTypes<ReportTableData>;
};
