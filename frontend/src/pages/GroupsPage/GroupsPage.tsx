import { Button, Card } from 'antd';
import { GroupsTable } from '@/components/tables/GroupsTable/GroupsTable.tsx';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { GroupCreateForm } from '@/components/forms/group/GroupCreateForm/GroupCreateForm.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { PlusOutlined } from '@ant-design/icons';

export const GroupsPage = () => {
    const [createModalOpen, openCreateModal, closeCreateModal] = useModal();

    return (
        <Card
            title="Группы"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    Добавить
                </Button>
            }
        >
            <GroupsTable />

            <ModalRaw
                title="Новая группа"
                open={createModalOpen}
                onCancel={closeCreateModal}
                width={600}
            >
                <GroupCreateForm onCreated={closeCreateModal} />
            </ModalRaw>
        </Card>
    );
};
