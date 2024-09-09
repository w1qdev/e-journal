import { Button, Form, Input, Select } from 'antd';
import { useCreateDepartmentMutation } from '@/api/department.api.ts';
import { FC } from 'react';
import { useGetUsersByRolesQuery } from '@/api/user.api.ts';
import { useSelect } from '@/hooks/use-select.ts';
import { selectSearch } from '@/constants/select-search.ts';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';

interface CreateDepartmentFormData {
    name: string;
    president_id: number;
}

interface Props {
    onCreated?: () => void;
}

export const DepartmentCreateForm: FC<Props> = ({ onCreated }) => {
    const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();

    const { data: presidents, isLoading: isPresidentsLoading } = useGetUsersByRolesQuery([
        'TEACHER',
        'SCHEDULE_CREATOR',
        'ADMIN',
    ]);
    const presidentsOptions = useSelect(presidents || [], 'id', 'full_name');

    const onFinish = async (data: CreateDepartmentFormData) => {
        await createDepartment(data);
        onCreated?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
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
                <Button htmlType="submit" loading={isCreating} type="primary">
                    Создать
                </Button>
            </Form.Item>
        </Form>
    );
};
