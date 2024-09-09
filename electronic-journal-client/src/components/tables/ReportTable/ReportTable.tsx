import { Table } from 'antd';
import { useGetUsersByGroupQuery } from '@/api/user.api.ts';
import { Group } from '@/types/group.types.ts';
import { FC, useMemo, useState } from 'react';
import { useGetReportQuery } from '@/api/report.api.ts';
import {
    getReportColumns,
    ReportTableColumnsType,
    ReportTableData,
} from '@/components/tables/ReportTable/columns.tsx';
import { User } from '@/types/user.types.ts';
import { useAppSelector } from '@/hooks/use-store.ts';
import { selectUser, selectUserRole } from '@/store/features/user/user.selectors.ts';
import { JournalTableData } from '@/components/tables/JournalTable/columns.tsx';
import { ColumnsType } from 'antd/es/table';
import { ReportCell, ReportCellProps } from '@/components/tables/ReportTable/ReportCell.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { Report } from '@/types/report.types.ts';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { ReportCreateValueForm } from '@/components/forms/report/ReportCreateValueForm/ReportCreateValueForm.tsx';
import { ReportUpdateValueForm } from '@/components/forms/report/ReportUpdateValueForm/ReportUpdateValueForm.tsx';
import { EmptyWrapper } from '@/components/ui/EmptyWrapper/EmptyWrapper.tsx';

interface Props {
    group?: Group;
    dateFrom: string;
    dateTo: string;
}

export const ReportTable: FC<Props> = ({ group, dateTo, dateFrom }) => {
    const user = useAppSelector(selectUser);
    const role = useAppSelector(selectUserRole);

    const [createParamId, setCreateParamId] = useState<number>();
    const [createStudentId, setCreateStudentId] = useState<number>();
    const [createModalOpen, openCreateModal, closeCreateModal] = useModal();

    const [updateReport, setUpdateReport] = useState<Report>();
    const [updateModalOpen, openUpdateModal, closeUpdateModal] = useModal();

    const { data: students, isFetching: isStudentsFetching } = useGetUsersByGroupQuery(group?.id!, {
        skip: !group || role?.slug === 'STUDENT',
    });

    const { data: params, isFetching: isParamsFetching } = useGetReportQuery(
        { group_id: group?.id!, from: dateFrom, to: dateTo },
        { skip: !group },
    );

    const dataSource: ReportTableData[] = useMemo(() => {
        if (!params) return [];

        let sourceStudents: User[] = [];
        if (students) sourceStudents = students;
        if (user && role?.slug === 'STUDENT') sourceStudents = [user];

        return sourceStudents.map((student) => {
            const data: JournalTableData = {
                key: student.id,
                student: student,
            };

            params.forEach((param) => {
                data[param.id] =
                    param.report.find((i) => i.student.id === student.id)?.value || null;
            });

            return data;
        });
    }, [students, params]);

    const columns = useMemo(() => {
        const formatColumn = (col: ReportTableColumnsType) => {
            if (col.key === 'student') {
                return {
                    ...col,
                    onCell: (record: ReportTableData) => ({
                        record,
                        dataIndex: col.dataIndex,
                        fixed: !!col.fixed,
                    }),
                };
            }

            return {
                ...col,
                onCell: (record: ReportTableData) => {
                    const props: Omit<ReportCellProps, 'children'> = {
                        record,
                        dataIndex: col.dataIndex,
                        fixed: !!col.fixed,
                    };

                    const colParam = params?.find((param) => param.id === col.key);

                    if (
                        (!colParam?.subject.teacher && role?.slug === 'TEACHER') ||
                        colParam?.subject.teacher?.id === user?.id ||
                        role?.slug === 'ADMIN'
                    ) {
                        props.onCreateReportValue = () => {
                            setCreateParamId(col.key as number);
                            setCreateStudentId(record.student.id);
                            openCreateModal();
                        };

                        props.onUpdateReportValue = () => {
                            const reports = params?.find((param) => param.id === col.key)?.report;
                            setUpdateReport(
                                reports?.find((anus) => anus.student.id === record.student.id),
                            );
                            openUpdateModal();
                        };
                    }

                    return props;
                },
            };
        };

        return getReportColumns(params || ([] as any)).map((col) => {
            if (col.children) {
                return { ...col, children: col.children.map((childCol) => formatColumn(childCol)) };
            }

            return formatColumn(col);
        });
    }, [params]) as ColumnsType<JournalTableData>;

    return (
        <EmptyWrapper empty={params?.length === 0} loading={isStudentsFetching || isParamsFetching}>
            <Table
                rowClassName="highlight-table-row"
                columns={columns}
                dataSource={dataSource}
                bordered
                scroll={{ x: 800, y: 'calc(100vh - 288px)' }}
                components={{ body: { cell: ReportCell } }}
                size="small"
                pagination={false}
            />

            <ModalRaw
                title="Установка значения"
                open={createModalOpen}
                onCancel={closeCreateModal}
                width={600}
            >
                <ReportCreateValueForm
                    schedule_param_id={createParamId}
                    student_id={createStudentId}
                    onComplete={closeCreateModal}
                />
            </ModalRaw>

            <ModalRaw
                title="Редактирование значения"
                open={updateModalOpen}
                onCancel={closeUpdateModal}
                width={600}
            >
                <ReportUpdateValueForm report={updateReport} onComplete={closeUpdateModal} />
            </ModalRaw>
        </EmptyWrapper>
    );
};
