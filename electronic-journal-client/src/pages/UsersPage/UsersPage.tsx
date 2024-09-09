import { Button, Card } from 'antd';
import { UsersTable } from '@/components/tables/UsersTable/UsersTable.tsx';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { UserCreateForm } from '@/components/forms/user/UserCreateForm/UserCreateForm.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { PlusOutlined } from '@ant-design/icons';

export const UsersPage = () => {
    const [createModalOpen, openCreateModal, closeCreateModal] = useModal();

    return (
        <Card
            title="Пользователи"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    Добавить
                </Button>
            }
        >
            <UsersTable />

            <ModalRaw
                title="Новый пользователь"
                open={createModalOpen}
                onCancel={closeCreateModal}
                width={600}
            >
                <UserCreateForm onCreated={closeCreateModal} />
            </ModalRaw>
        </Card>
    );
};
