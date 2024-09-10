import { Button, Form, Input, Select } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { FC } from 'react';
import { useCreateScheduleParamMutation } from '@/api/schedule-param.api.ts';
import { useSelectSubjects } from '@/hooks/use-select-subjects.ts';
import { useGetGroupByIdQuery } from '@/api/group.api.ts';
import { selectSearch } from '@/constants/select-search.ts';

interface ScheduleParamCreateFormData {
    subject_id: number;
    first_half: string | null;
    sub_group: string | null;
    office?: number;
}

interface Props {
    schedule_id?: number;
    group_id?: number;
    number?: number;
    onCreated?: () => void;
}

export const ScheduleParamCreateForm: FC<Props> = ({
    schedule_id,
    group_id,
    number,
    onCreated,
}) => {
    const [createParam, { isLoading: isCreating }] = useCreateScheduleParamMutation();

    const { data: group, isLoading: isSubjectsLoading } = useGetGroupByIdQuery(group_id!, {
        skip: !group_id,
    });
    const subjectsOptions = useSelectSubjects(group?.subjects || []);

    const onFinish = async (data: ScheduleParamCreateFormData) => {
        if (!schedule_id || !group_id || !number) return;

        await createParam({
            schedule_id,
            group_id,
            number,
            ...data,
        });
        onCreated?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
            initialValues={{
                first_half: null,
                sub_group: null,
            }}
        >
            <Form.Item name="subject_id" label="Предмет" rules={[REQUIRED_RULE]}>
                <Select
                    options={subjectsOptions}
                    loading={isSubjectsLoading}
                    {...selectSearch}
                    placeholder="Предмет"
                />
            </Form.Item>
            <Form.Item name="office" label="Кабинет">
                <Input placeholder="Кабинет" />
            </Form.Item>
            <Form.Item name="first_half" label="Первая половина">
                <Input placeholder="Первая половина" />
            </Form.Item>
            <Form.Item name="sub_group" label="Подгруппа">
                <Input placeholder="Подгруппа" />
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'right' }}>
                <Button htmlType="submit" loading={isCreating} type="primary">
                    Создать
                </Button>
            </Form.Item>
        </Form>
    );
};
