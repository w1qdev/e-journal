import { Button, Card } from 'antd';
import { useModal } from '@/hooks/use-modal.ts';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { PlusOutlined } from '@ant-design/icons';
import { SubjectCreateForm } from '@/components/forms/subject/SubjectCreateForm/SubjectCreateForm.tsx';
import { SubjectsTable } from '@/components/tables/SubjectsTable/SubjectsTable.tsx';

export const SubjectsPage = () => {
    const [createModalOpen, openCreateModal, closeCreateModal] = useModal();

    return (
        <Card
            title="Предметы"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    Добавить
                </Button>
            }
        >
            <SubjectsTable />

            <ModalRaw
                title="Новый предмет"
                open={createModalOpen}
                onCancel={closeCreateModal}
                width={600}
            >
                <SubjectCreateForm onCreated={closeCreateModal} />
            </ModalRaw>
        </Card>
    );
};
