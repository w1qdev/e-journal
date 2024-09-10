import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { FC } from 'react';
import { ScheduleParam } from '@/types/schedule.types.ts';
import {
    useRemoveScheduleParamMutation,
    useUpdateScheduleParamMutation,
} from '@/api/schedule-param.api.ts';
import { useGetGroupByIdQuery } from '@/api/group.api.ts';
import { useSelectSubjects } from '@/hooks/use-select-subjects.ts';
import { selectSearch } from '@/constants/select-search.ts';
import { useAppSelector } from '@/hooks/use-store.ts';
import { selectUserRole } from '@/store/features/user/user.selectors.ts';
import dayjs, { Dayjs } from 'dayjs';
import { dayjsToDatetime } from '@/utils/dayjs-to-datetime.ts';

interface ScheduleParamUpdateFormData {
    subject_id: number;
    first_half: string | null;
    sub_group: string | null;
    office?: number;
    lesson_type: string;
    lesson_code: string;
    homework: string;
    topic: string;
    end_date: Dayjs;
}

interface Props {
    param?: ScheduleParam;
    onComplete?: () => void;
    openFrom: 'JOURNAL' | 'SCHEDULE';
}

export const ScheduleParamUpdateForm: FC<Props> = ({ param, onComplete, openFrom }) => {
    const userRole = useAppSelector(selectUserRole);

    const [updateParam, { isLoading: isUpdating }] = useUpdateScheduleParamMutation();
    const [removeParam, { isLoading: isRemoving }] = useRemoveScheduleParamMutation();

    const { data: group, isLoading: isSubjectsLoading } = useGetGroupByIdQuery(param?.group.id!, {
        skip: !param?.group.id,
    });
    const subjectsOptions = useSelectSubjects(group?.subjects || []);

    const onFinish = async (data: ScheduleParamUpdateFormData) => {
        if (!param) return;

        await updateParam({
            param_id: param.id,
            subject_id: openFrom === 'SCHEDULE' ? data.subject_id : param.subject.id,
            first_half: openFrom === 'SCHEDULE' ? data.first_half : param.first_half,
            sub_group: openFrom === 'SCHEDULE' ? data.sub_group : param.sub_group,
            office: openFrom === 'SCHEDULE' ? data.office : param.office,
            lesson_type: openFrom == 'JOURNAL' ? data.lesson_type : param.lesson_type,
            lesson_code: openFrom == 'JOURNAL' ? data.lesson_code : param.lesson_code,
            homework: openFrom == 'JOURNAL' ? data.homework : param.homework,
            topic: openFrom == 'JOURNAL' ? data.topic : param.topic,
            end_date:
                openFrom == 'JOURNAL'
                    ? data.end_date
                        ? dayjsToDatetime(data.end_date)
                        : null
                    : param.end_date,
        });

        onComplete?.();
    };

    const onRemove = async () => {
        if (!param) return;
        await removeParam(param.id);
        onComplete?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
            initialValues={{
                subject_id: param?.subject.id,
                office: param?.office,
                first_half: param?.first_half,
                sub_group: param?.sub_group,
                lesson_type: param?.lesson_type,
                lesson_code: param?.lesson_code,
                homework: param?.homework,
                topic: param?.topic,
                end_date: dayjs(param?.end_date).isValid() ? dayjs(param?.end_date) : null,
            }}
        >
            {openFrom === 'SCHEDULE' && (
                <>
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
                </>
            )}
            {openFrom === 'JOURNAL' && (
                <>
                    <Form.Item name="lesson_type" label="Тип пары">
                        <Select
                            options={[
                                { value: 'LECTURE', label: 'Лекция' },
                                { value: 'PRACTICE', label: 'Практика' },
                                { value: 'LAB_WORK', label: 'Лаб. работа' },
                                { value: 'SELF_WORK', label: 'Сам. работа' },
                            ]}
                            {...selectSearch}
                            placeholder="Тип пары"
                        />
                    </Form.Item>

                    <Form.Item name="lesson_code" label="Код занятия">
                        <Input placeholder="Код занятия" />
                    </Form.Item>

                    <Form.Item name="topic" label="Тема занятия">
                        <Input placeholder="Тема занятия" />
                    </Form.Item>

                    <Form.Item name="homework" label="Домашнее задание">
                        <Input placeholder="Домашнее задание" />
                    </Form.Item>

                    <Form.Item name="end_date" label="Срок сдачи задания">
                        <DatePicker
                            placeholder="Срок сдачи задания"
                            style={{ width: '100%' }}
                            format={'DD.MM.YYYY'}
                        />
                    </Form.Item>
                </>
            )}
            <Form.Item style={{ display: 'flex', justifyContent: 'right' }}>
                <Space>
                    {['SCHEDULE_CREATOR', 'ADMIN'].includes(userRole?.slug || '') && (
                        <Button onClick={onRemove} loading={isRemoving} type="primary" danger>
                            Удалить
                        </Button>
                    )}
                    <Button htmlType="submit" loading={isUpdating} type="primary">
                        Сохранить
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
