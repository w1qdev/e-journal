import { Button, Form, Input, Select } from 'antd';
import { Department } from '@/types/department.types.ts';
import { FC } from 'react';
import { useUpdateDepartmentMutation } from '@/api/department.api.ts';
import { useGetUsersByRolesQuery } from '@/api/user.api.ts';
import { useSelect } from '@/hooks/use-select.ts';
import { selectSearch } from '@/constants/select-search.ts';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';

interface UpdateDepartmentFormData {
    name: string;
    president_id: number;
}

interface Props {
    department?: Department;
    onUpdated?: () => void;
}

export const DepartmentUpdateForm: FC<Props> = ({ department, onUpdated }) => {
    const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();

    const { data: presidents, isLoading: isPresidentsLoading } = useGetUsersByRolesQuery([
        'TEACHER',
        'SCHEDULE_CREATOR',
        'ADMIN',
    ]);
    const presidentsOptions = useSelect(presidents || [], 'id', 'full_name');

    const onFinish = async (data: UpdateDepartmentFormData) => {
        if (!department) return;
        await updateDepartment({ department_id: department.id, ...data });
        onUpdated?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
            initialValues={{
                name: department?.name,
                president_id: department?.president.id,
            }}
        >
            <Form.Item name="name" label="Название" rules={[REQUIRED_RULE]}>
                <Input placeholder={'Название'}/>
            </Form.Item>
            <Form.Item name="president_id" label="Председатель" rules={[REQUIRED_RULE]}>
                <Select
                    options={presidentsOptions}
                    loading={isPresidentsLoading}
                    {...selectSearch}
                    placeholder={'Председатель'}
                />
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'right' }}>
                <Button htmlType="submit" loading={isUpdating} type="primary">
                    Сохранить
                </Button>
            </Form.Item>
        </Form>
    );
};
