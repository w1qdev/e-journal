import { Table } from 'antd';
import {
    useChangeScheduleVisibilityMutation,
    useGetSchedulesQuery,
    useRemoveScheduleMutation,
} from '@/api/schedule.api.ts';
import { useMemo, useState } from 'react';
import { getSchedulesColumns } from '@/components/tables/SchedulesTable/columns.tsx';
import { Schedule } from '@/types/schedule.types.ts';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { ScheduleUpdateForm } from '@/components/forms/schedule/ScheduleUpdateForm/ScheduleUpdateForm.tsx';

export const SchedulesTable = () => {
    const { data, isFetching } = useGetSchedulesQuery(null);
    const [removeSchedule, { isLoading: isRemoving }] = useRemoveScheduleMutation();
    const [changeVisibility, { isLoading: isChanging }] = useChangeScheduleVisibilityMutation();

    const [schedule, setSchedule] = useState<Schedule>();
    const [updateModalOpen, openUpdateModal, closeUpdateModal] = useModal();

    const dataSource = useMemo(() => {
        return data?.map((item) => ({ key: item.id, ...item }));
    }, [data]);

    const onUpdateHandler = (schedule: Schedule) => {
        setSchedule(schedule);
        openUpdateModal();
    };

    const onRemoveHandler = (schedule: Schedule) => {
        removeSchedule(schedule.id);
    };

    const onChangeVisibility = (schedule: Schedule) => {
        changeVisibility({ schedule_id: schedule.id, visible: !schedule.visible });
    };

    return (
        <>
            <Table
                columns={getSchedulesColumns(onUpdateHandler, onRemoveHandler, onChangeVisibility)}
                dataSource={dataSource}
                loading={isFetching || isRemoving || isChanging}
                bordered
            />

            <ModalRaw
                title="Редактирование расписания"
                open={updateModalOpen}
                onCancel={closeUpdateModal}
                width={600}
            >
                <ScheduleUpdateForm schedule={schedule} onUpdated={closeUpdateModal} />
            </ModalRaw>
        </>
    );
};
