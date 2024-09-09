import { Button, Card } from 'antd';
import { DepartmentsTable } from '@/components/tables/DepartmentsTable/DepartmentsTable.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { PlusOutlined } from '@ant-design/icons';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { DepartmentCreateForm } from '@/components/forms/department/DepartmentCreateForm/DepartmentCreateForm.tsx';

export const DepartmentsPage = () => {
    const [createModalOpen, openCreateModal, closeCreateModal] = useModal();

    return (
        <Card
            title="Отделы"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    Добавить
                </Button>
            }
        >
            <DepartmentsTable />

            <ModalRaw
                title="Новый отдел"
                open={createModalOpen}
                onCancel={closeCreateModal}
                width={600}
            >
                <DepartmentCreateForm onCreated={closeCreateModal} />
            </ModalRaw>
        </Card>
    );
};
