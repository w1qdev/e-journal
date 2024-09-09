import { Button, Form, Input, Select } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { useGetUsersByRolesQuery } from '@/api/user.api.ts';
import { useSelect } from '@/hooks/use-select.ts';
import { Subject } from '@/types/subject.types.ts';
import { FC } from 'react';
import { useUpdateSubjectMutation } from '@/api/subject.api.ts';
import { selectSearch } from '@/constants/select-search.ts';

interface SubjectUpdateFormData {
    name: string;
    slug: string;
    code: string;
    teacher_id?: number;
}

interface Props {
    subject?: Subject;
    onUpdated?: () => void;
}

export const SubjectUpdateForm: FC<Props> = ({ subject, onUpdated }) => {
    const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();

    const { data, isLoading } = useGetUsersByRolesQuery(['TEACHER']);
    const options = useSelect(data || [], 'id', 'full_name');

    const onFinish = async (data: SubjectUpdateFormData) => {
        if (!subject) return;
        await updateSubject({ subject_id: subject.id, ...data });
        onUpdated?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
            initialValues={{
                name: subject?.name,
                slug: subject?.slug,
                code: subject?.code,
                teacher_id: subject?.teacher?.id,
            }}
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
                <Button htmlType="submit" loading={isUpdating} type="primary">
                    Обновить
                </Button>
            </Form.Item>
        </Form>
    );
};
