import { Table } from 'antd';
import { useGetUsersQuery, useRemoveUserMutation } from '@/api/user.api.ts';
import { useMemo, useState } from 'react';
import { getUserColumns } from './columns.tsx';
import { User } from '@/types/user.types.ts';
import { useModal } from '@/hooks/use-modal.ts';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { UserUpdateForm } from '@/components/forms/user/UserUpdateForm/UserUpdateForm.tsx';

export const UsersTable = () => {
    const { data, isFetching } = useGetUsersQuery(null);
    const [removeUser, { isLoading: isRemoving }] = useRemoveUserMutation();

    const [user, setUser] = useState<User>();
    const [updateModalOpen, openUpdateModal, closeUpdateModal] = useModal();

    const dataSource = useMemo(() => {
        return data?.map((item) => ({ key: item.id, ...item }));
    }, [data]);

    const onUpdateHandler = (user: User) => {
        setUser(user);
        openUpdateModal();
    };

    const onRemoveHandler = (user: User) => {
        removeUser(user.id);
    };

    return (
        <>
            <Table
                columns={getUserColumns(onUpdateHandler, onRemoveHandler)}
                dataSource={dataSource}
                loading={isFetching || isRemoving}
                bordered
                scroll={{ x: 1000 }}
            />

            <ModalRaw
                title="Редактирование пользователя"
                open={updateModalOpen}
                onCancel={closeUpdateModal}
                width={600}
            >
                <UserUpdateForm user={user} onComplete={closeUpdateModal} />
            </ModalRaw>
        </>
    );
};
