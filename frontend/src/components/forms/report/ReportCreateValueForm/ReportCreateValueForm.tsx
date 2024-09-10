import { FC } from 'react';
import { Button, Form, Select } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { useCreateReportValueMutation } from '@/api/report.api.ts';

interface ReportCreateRateFormData {
    value: string;
}

interface Props {
    schedule_param_id?: number;
    student_id?: number;
    onComplete?: () => void;
}

export const ReportCreateValueForm: FC<Props> = ({ schedule_param_id, student_id, onComplete }) => {
    const [createValue, { isLoading: isCreating }] = useCreateReportValueMutation();

    const onFinish = async (data: ReportCreateRateFormData) => {
        if (!schedule_param_id || !student_id) return;

        await createValue({
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
            <Form.Item name="value" label="Значение" rules={[REQUIRED_RULE]}>
                <Select
                    options={[
                        { value: '1', label: 1 },
                        { value: '2', label: 2 },
                        { value: 'оп', label: 'оп' },
                    ]}
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
