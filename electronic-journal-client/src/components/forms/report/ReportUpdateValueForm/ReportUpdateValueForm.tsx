import { FC } from 'react';
import { Button, Form, Select, Space } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { useRemoveReportValueMutation, useUpdateReportValueMutation } from '@/api/report.api.ts';
import { Report } from '@/types/report.types.ts';

interface ReportUpdateValueFormData {
    value: string;
}

interface Props {
    report?: Report;
    onComplete?: () => void;
}

export const ReportUpdateValueForm: FC<Props> = ({ report, onComplete }) => {
    const [updateValue, { isLoading: isUpdating }] = useUpdateReportValueMutation();
    const [removeValue, { isLoading: isRemoving }] = useRemoveReportValueMutation();

    const onFinish = async (data: ReportUpdateValueFormData) => {
        if (!report) return;

        await updateValue({
            report_id: report.id,
            student_id: report.student.id,
            ...data,
        });

        onComplete?.();
    };

    const onRemove = async () => {
        if (!report) return;
        await removeValue(report.id);
        onComplete?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
            initialValues={{
                value: report?.value,
            }}
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
                <Space>
                    <Button onClick={onRemove} loading={isRemoving} type="primary" danger>
                        Удалить
                    </Button>
                    <Button htmlType="submit" loading={isUpdating} type="primary">
                        Сохранить
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
