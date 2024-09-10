import { Table } from 'antd';
import { useGetDepartmentsQuery, useRemoveDepartmentMutation } from '@/api/department.api.ts';
import { useMemo, useState } from 'react';
import { getDepartmentColumns } from '@/components/tables/DepartmentsTable/columns.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { Department } from '@/types/department.types.ts';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { DepartmentUpdateForm } from '@/components/forms/department/DepartmentUpdateForm/DepartmentUpdateForm.tsx';

export const DepartmentsTable = () => {
    const { data, isFetching } = useGetDepartmentsQuery(null);

    const [removeDepartment, { isLoading: isRemoving }] = useRemoveDepartmentMutation();

    const [department, setDepartment] = useState<Department>();
    const [updateModalOpen, openUpdateModal, closeUpdateModal] = useModal();

    const dataSource = useMemo(() => {
        return data?.map((item) => ({ key: item.id, ...item }));
    }, [data]);

    const onUpdateHandler = (department: Department) => {
        setDepartment(department);
        openUpdateModal();
    };

    const onRemoveHandler = (department: Department) => {
        removeDepartment(department.id);
    };

    return (
        <>
            <Table
                columns={getDepartmentColumns(onUpdateHandler, onRemoveHandler)}
                dataSource={dataSource}
                loading={isFetching || isRemoving}
                bordered
                scroll={{ x: 1000 }}
            />

            <ModalRaw
                title="Редактирование отдела"
                open={updateModalOpen}
                onCancel={closeUpdateModal}
                width={600}
            >
                <DepartmentUpdateForm department={department} onUpdated={closeUpdateModal} />
            </ModalRaw>
        </>
    );
};
