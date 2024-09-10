import { Button, Card } from 'antd';
import { ProfessionsTable } from '@/components/tables/ProfessionsTable/ProfessionsTable.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { PlusOutlined } from '@ant-design/icons';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { ProfessionCreateForm } from '@/components/forms/profession/ProfessionCreateForm/ProfessionCreateForm.tsx';

export const ProfessionsPage = () => {
    const [createModalOpen, openCreateModal, closeCreateModal] = useModal();

    return (
        <Card
            title="Специальности"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    Добавить
                </Button>
            }
        >
            <ProfessionsTable />

            <ModalRaw
                title="Новая специальность"
                open={createModalOpen}
                onCancel={closeCreateModal}
                width={600}
            >
                <ProfessionCreateForm onCreated={closeCreateModal} />
            </ModalRaw>
        </Card>
    );
};
