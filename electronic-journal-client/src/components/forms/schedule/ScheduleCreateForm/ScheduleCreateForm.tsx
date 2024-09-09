import { Button, DatePicker, Form } from 'antd';
import { FC } from 'react';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { useCreateScheduleMutation } from '@/api/schedule.api.ts';
import { Dayjs } from 'dayjs';
import { dayjsToDatetime } from '@/utils/dayjs-to-datetime.ts';

interface ScheduleCreateFormData {
    date: Dayjs;
}

interface Props {
    onCreated?: () => void;
}

export const ScheduleCreateForm: FC<Props> = ({ onCreated }) => {
    const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation();

    const onFinish = async (data: ScheduleCreateFormData) => {
        await createSchedule({ date: dayjsToDatetime(data.date) });
        onCreated?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
        >
            <Form.Item name="date" label="Дата" rules={[REQUIRED_RULE]}>
                <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} placeholder={'Дата'}/>
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'right' }}>
                <Button htmlType="submit" loading={isCreating} type="primary">
                    Создать
                </Button>
            </Form.Item>
        </Form>
    );
};
