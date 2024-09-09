import { Button, Form, Input, InputNumber, Select } from 'antd';
import { FC } from 'react';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { useCreateGroupMutation } from '@/api/group.api.ts';
import { useGetUsersByRolesQuery } from '@/api/user.api.ts';
import { useSelect } from '@/hooks/use-select.ts';
import { useGetProfessionsQuery } from '@/api/profession.api.ts';
import { selectSearch } from '@/constants/select-search.ts';

interface GroupCreateFormData {
    name: string;
    course: number;
    profession_id: number;
    tutor_id: number;
}

interface Props {
    onCreated?: () => void;
}

export const GroupCreateForm: FC<Props> = ({ onCreated }) => {
    const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();

    const { data: tutors, isLoading: isTutorsLoading } = useGetUsersByRolesQuery([
        'TEACHER',
        'ADMIN',
        'SCHEDULE_CREATOR',
    ]);
    const teachersOptions = useSelect(tutors || [], 'id', 'full_name');

    const { data: profession, isLoading: isProfessionsLoading } = useGetProfessionsQuery(null);
    const professionsOptions = useSelect(profession || [], 'id', 'name');

    const onFinish = async (data: GroupCreateFormData) => {
        await createGroup(data);
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
                <Input placeholder="Название"/>
            </Form.Item>
            <Form.Item name="course" label="Курс" rules={[REQUIRED_RULE]}>
                <InputNumber min={1} max={4} placeholder="Курс" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="profession_id" label="Специальность" rules={[REQUIRED_RULE]}>
                <Select
                    options={professionsOptions}
                    loading={isProfessionsLoading}
                    {...selectSearch}
                    placeholder={'Специальность'}
                />
            </Form.Item>
            <Form.Item name="tutor_id" label="Куратор" rules={[REQUIRED_RULE]}>
                <Select
                    options={teachersOptions}
                    loading={isTutorsLoading}
                    {...selectSearch}
                    placeholder={'Куратор'}
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
