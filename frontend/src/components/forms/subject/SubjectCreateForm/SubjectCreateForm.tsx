import { Button, Form, Input, Select } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { useGetUsersByRolesQuery } from '@/api/user.api.ts';
import { FC } from 'react';
import { useCreateSubjectMutation } from '@/api/subject.api.ts';
import { useSelect } from '@/hooks/use-select.ts';
import { selectSearch } from '@/constants/select-search.ts';

interface SubjectCreateFormData {
    name: string;
    slug: string;
    code: string;
    teacher_id?: number;
}

interface Props {
    onCreated?: () => void;
}

export const SubjectCreateForm: FC<Props> = ({ onCreated }) => {
    const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();

    const { data, isLoading } = useGetUsersByRolesQuery(['TEACHER']);
    const options = useSelect(data || [], 'id', 'full_name');

    const onFinish = async (data: SubjectCreateFormData) => {
        await createSubject(data);
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
                <Input placeholder="Название" />
            </Form.Item>
            <Form.Item name="slug" label="Краткое название" rules={[REQUIRED_RULE]}>
                <Input placeholder="Краткое название" />
            </Form.Item>
            <Form.Item name="code" label="Код" rules={[REQUIRED_RULE]}>
                <Input placeholder="Код" />
            </Form.Item>
            <Form.Item name="teacher_id" label="Преподаватель">
                <Select
                    options={options}
                    loading={isLoading}
                    {...selectSearch}
                    placeholder="Преподаватель"
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
