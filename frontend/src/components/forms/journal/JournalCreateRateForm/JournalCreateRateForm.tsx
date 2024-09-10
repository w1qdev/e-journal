import { Button, Form, Select } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { useCreateJournalRateMutation } from '@/api/journal.api.ts';
import { FC } from 'react';

interface JournalCreateRateFormData {
    rate: string;
}

interface Props {
    schedule_param_id?: number;
    student_id?: number;
    onComplete?: () => void;
}

export const JournalCreateRateForm: FC<Props> = ({ schedule_param_id, onComplete, student_id }) => {
    const [createRate, { isLoading: isCreating }] = useCreateJournalRateMutation();

    const onFinish = async (data: JournalCreateRateFormData) => {
        if (!schedule_param_id || !student_id) return;

        await createRate({
            schedule_param_id,
            student_id,
            ...data,
        });

        onComplete?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
        >
            <Form.Item name="rate" label="Оценка" rules={[REQUIRED_RULE]}>
                <Select
                    options={[
                        { value: 'нб', label: 'нб' },
                        { value: '1', label: 1 },
                        { value: '2', label: 2 },
                        { value: '3', label: 3 },
                        { value: '4', label: 4 },
                        { value: '5', label: 5 },
                        { value: 'н/а', label: 'н/а' },
                    ]}
                    placeholder={'Оценка'}
                />
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'right' }}>
                <Button htmlType="submit" loading={isCreating} type="primary">
                    Выставить
                </Button>
            </Form.Item>
        </Form>
    );
};
