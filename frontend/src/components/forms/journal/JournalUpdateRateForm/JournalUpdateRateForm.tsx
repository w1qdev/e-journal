import { Button, Form, Select, Space } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { useRemoveJournalRateMutation, useUpdateJournalRateMutation } from '@/api/journal.api.ts';
import { FC } from 'react';
import { Journal } from '@/types/journal.types.ts';

interface JournalUpdateRateFormData {
    rate: string;
}

interface Props {
    journal?: Journal;
    onComplete?: () => void;
}

export const JournalUpdateRateForm: FC<Props> = ({ journal, onComplete }) => {
    const [updateRate, { isLoading: isUpdating }] = useUpdateJournalRateMutation();
    const [removeRate, { isLoading: isRemoving }] = useRemoveJournalRateMutation();

    const onFinish = async (data: JournalUpdateRateFormData) => {
        if (!journal) return;

        await updateRate({
            journal_id: journal.id,
            student_id: journal.student.id,
            ...data,
        });

        onComplete?.();
    };

    const onRemove = async () => {
        if (!journal) return;
        await removeRate(journal.id);
        onComplete?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
            initialValues={{
                rate: journal?.rate,
            }}
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
