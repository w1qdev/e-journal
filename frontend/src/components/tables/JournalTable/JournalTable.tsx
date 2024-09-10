import { FC, useMemo, useState } from 'react';
import { Table } from 'antd';
import { useGetUsersByGroupQuery } from '@/api/user.api.ts';
import { Group } from '@/types/group.types.ts';
import { Subject } from '@/types/subject.types.ts';
import { useGetJournalQuery } from '@/api/journal.api.ts';
import { getJournalColumns, JournalTableData } from '@/components/tables/JournalTable/columns.tsx';
import { RateCell, RateCellProps } from '@/components/tables/JournalTable/RateCell.tsx';
import { ColumnsType } from 'antd/es/table';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { JournalCreateRateForm } from '@/components/forms/journal/JournalCreateRateForm/JournalCreateRateForm.tsx';
import { Journal } from '@/types/journal.types.ts';
import { JournalUpdateRateForm } from '@/components/forms/journal/JournalUpdateRateForm/JournalUpdateRateForm.tsx';
import { useAppSelector } from '@/hooks/use-store.ts';
import { selectUser, selectUserRole } from '@/store/features/user/user.selectors.ts';
import { User } from '@/types/user.types.ts';
import { ScheduleParamWithJournal } from '@/types/schedule.types.ts';
import { formatDate } from '@/utils/format-date.ts';
import { ScheduleParamUpdateForm } from '@/components/forms/schedule-param/ScheduleParamUpdateForm/ScheduleParamUpdateForm.tsx';
import { useRemoveScheduleParamMutation } from '@/api/schedule-param.api.ts';
import { EmptyWrapper } from '@/components/ui/EmptyWrapper/EmptyWrapper.tsx';

interface Props {
    group?: Group;
    subject?: Subject;
    lesson: 'ALL' | 'PRACTICE' | 'LECTURE' | 'LAB_WORK' | 'SELF_WORK';
}

export const JournalTable: FC<Props> = ({ group, subject, lesson }) => {
    const user = useAppSelector(selectUser);
    const role = useAppSelector(selectUserRole);

    const [removeParam, { isLoading: isParamRemoving }] = useRemoveScheduleParamMutation();

    const [createParamId, setCreateParamId] = useState<number>();
    const [createStudentId, setCreateStudentId] = useState<number>();
    const [createModalOpen, openCreateModal, closeCreateModal] = useModal();

    const [updateJournal, setUpdateJournal] = useState<Journal>();
    const [updateModalOpen, openUpdateModal, closeUpdateModal] = useModal();

    const [updateParamModelOpen, openUpdateParamModelOpen, closeUpdateParamModelOpen] = useModal();
    const [paramData, setParamData] = useState<ScheduleParamWithJournal>();

    const onParamClick = (param: ScheduleParamWithJournal) => {
        if (role?.slug !== 'STUDENT') {
            setParamData(param);
            openUpdateParamModelOpen();
        }
    };

    const onParamRemove = async (param: ScheduleParamWithJournal) => {
        await removeParam(param.id);
    };

    const { data: students, isFetching: isStudentsFetching } = useGetUsersByGroupQuery(group?.id!, {
        skip: !group || role?.slug === 'STUDENT',
    });
    const { data: params, isFetching: isParamsFetching } = useGetJournalQuery(
        {
            group_id: group?.id!,
            subject_id: subject?.id!,
            lesson_type: lesson,
        },
        { skip: !group || !subject },
    );

    const dataSource: JournalTableData[] = useMemo(() => {
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
                    param.journal.find((i) => i.student.id === student.id)?.rate || null;
            });

            return data;
        });
    }, [students, params]);

    const columns = useMemo(() => {
        return getJournalColumns(user!, params || [], onParamClick, onParamRemove).map((col) => {
            if (col.key === 'student') {
                return {
                    ...col,
                    onCell: (record: JournalTableData) => ({
                        record,
                        dataIndex: col.dataIndex,
                        fixed: !!col.fixed,
                    }),
                };
            }

            return {
                ...col,
                onCell: (record: JournalTableData) => {
                    const props: Omit<RateCellProps, 'children'> = {
                        record,
                        dataIndex: col.dataIndex,
                        fixed: !!col.fixed,
                    };

                    if (
                        (!subject?.teacher && role?.slug === 'TEACHER') ||
                        subject?.teacher?.id === user?.id ||
                        role?.slug === 'ADMIN'
                    ) {
                        props.onCreateRate = () => {
                            setCreateParamId(col.key as number);
                            setCreateStudentId(record.student.id);
                            openCreateModal();
                        };
                    }

                    if (
                        (!subject?.teacher && role?.slug === 'TEACHER') ||
                        subject?.teacher?.id === user?.id ||
                        role?.slug === 'ADMIN'
                    ) {
                        props.onUpdateRate = () => {
                            const journals = params?.find((param) => param.id === col.key)?.journal;
                            setUpdateJournal(
                                journals?.find((anus) => anus.student.id === record.student.id),
                            );
                            openUpdateModal();
                        };
                    }

                    return props;
                },
            };
        });
    }, [params]) as ColumnsType<JournalTableData>;

    return (
        <EmptyWrapper
            empty={params?.length === 0}
            loading={isStudentsFetching || isParamsFetching || isParamRemoving}
        >
            <Table
                rowClassName="highlight-table-row"
                sticky
                columns={columns}
                dataSource={dataSource}
                bordered
                pagination={false}
                size="small"
                components={{ body: { cell: RateCell } }}
                scroll={{ x: 800, y: 'calc(100vh - 249px)' }}
            />

            <ModalRaw
                title="Выставление оценки"
                open={createModalOpen}
                onCancel={closeCreateModal}
                width={600}
            >
                <JournalCreateRateForm
                    schedule_param_id={createParamId}
                    student_id={createStudentId}
                    onComplete={closeCreateModal}
                />
            </ModalRaw>

            <ModalRaw
                title="Редактирование оценки"
                open={updateModalOpen}
                onCancel={closeUpdateModal}
                width={600}
            >
                <JournalUpdateRateForm journal={updateJournal} onComplete={closeUpdateModal} />
            </ModalRaw>

            <ModalRaw
                title={`Редактирование пары от ${formatDate(paramData?.schedule.date)}`}
                open={updateParamModelOpen}
                onCancel={closeUpdateParamModelOpen}
                width={600}
            >
                <ScheduleParamUpdateForm
                    param={paramData}
                    onComplete={closeUpdateParamModelOpen}
                    openFrom={'JOURNAL'}
                />
            </ModalRaw>
        </EmptyWrapper>
    );
};
