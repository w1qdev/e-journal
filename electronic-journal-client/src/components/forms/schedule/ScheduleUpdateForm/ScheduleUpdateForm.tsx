import { Button, DatePicker, Form } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { dayjsToDatetime } from '@/utils/dayjs-to-datetime.ts';
import dayjs, { Dayjs } from 'dayjs';
import { Schedule } from '@/types/schedule.types.ts';
import { FC } from 'react';
import { useUpdateScheduleMutation } from '@/api/schedule.api.ts';

interface ScheduleCreateFormData {
    date: Dayjs;
}

interface Props {
    schedule?: Schedule;
    onUpdated?: () => void;
}

export const ScheduleUpdateForm: FC<Props> = ({ schedule, onUpdated }) => {
    const [updateSchedule, { isLoading: isUpdating }] = useUpdateScheduleMutation();

    const onFinish = async (data: ScheduleCreateFormData) => {
        if (!schedule) return;
        await updateSchedule({ schedule_id: schedule.id, date: dayjsToDatetime(data.date) });
        onUpdated?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
            initialValues={{
                date: dayjs(schedule?.date),
            }}
        >
            <Form.Item name="date" label="Дата" rules={[REQUIRED_RULE]}>
                <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} placeholder={'Дата'}/>
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'right' }}>
                <Button htmlType="submit" loading={isUpdating} type="primary">
                    Сохранить
                </Button>
            </Form.Item>
        </Form>
    );
};
