import { Table } from 'antd';
import { getGroupColumns } from './columns.tsx';
import { useGetGroupsQuery, useRemoveGroupMutation } from '@/api/group.api.ts';
import { useMemo, useState } from 'react';
import { Group } from '@/types/group.types.ts';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { GroupUpdateForm } from '@/components/forms/group/GroupUpdateForm/GroupUpdateForm.tsx';

export const GroupsTable = () => {
    const { data, isFetching } = useGetGroupsQuery(null);
    const [removeGroup, { isLoading: isRemoving }] = useRemoveGroupMutation();

    const [group, setGroup] = useState<Group>();
    const [updateModalOpen, openUpdateModal, closeUpdateModal] = useModal();

    const dataSource = useMemo(() => {
        return data?.map((item) => ({ key: item.id, ...item }));
    }, [data]);

    const onUpdateHandler = (group: Group) => {
        setGroup(group);
        openUpdateModal();
    };

    const onRemoveHandler = (group: Group) => {
        removeGroup(group.id);
    };

    return (
        <>
            <Table
                columns={getGroupColumns(onUpdateHandler, onRemoveHandler)}
                dataSource={dataSource}
                loading={isFetching || isRemoving}
                bordered
                scroll={{ x: 1000 }}
            />

            <ModalRaw
                title="Редактирование группы"
                open={updateModalOpen}
                onCancel={closeUpdateModal}
                width={600}
            >
                <GroupUpdateForm group={group} onUpdated={closeUpdateModal} />
            </ModalRaw>
        </>
    );
};
