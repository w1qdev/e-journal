import { Button, Form, Select } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { FC, useMemo } from 'react';
import { Group } from '@/types/group.types.ts';
import { Subject } from '@/types/subject.types.ts';
import { useGetJournalQuery } from '@/api/journal.api.ts';
import { formatDate } from '@/utils/format-date.ts';
import { useAddCertificationMutation } from '@/api/schedule-param.api.ts';

interface CreateAttestationFormData {
    certification_period: string;
    schedule_id: number;
}

interface Props {
    group?: Group;
    subject?: Subject;
    onCreated?: () => void;
}

export const AttestationCreateForm: FC<Props> = ({ group, subject, onCreated }) => {
    const { data: params, isFetching: isParamsFetching } = useGetJournalQuery(
        {
            group_id: group?.id!,
            subject_id: subject?.id!,
            lesson_type: 'ALL',
        },
        { skip: !group || !subject },
    );

    const uniqueParams = useMemo(() => {
        return params?.filter(
            (v, i, a) => a.map((e) => e.schedule.id).indexOf(v.schedule.id) === i,
        );
    }, [params]);

    const [createCertification, { isLoading: isCreating }] = useAddCertificationMutation();

    const onFinish = async (data: CreateAttestationFormData) => {
        if (!group || !subject) return;
        await createCertification({
            schedule_id: data.schedule_id,
            group_id: group.id,
            subject_id: subject.id,
            certification_period: data.certification_period,
        });
        onCreated?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
        >
            <Form.Item name="certification_period" label="Период" rules={[REQUIRED_RULE]}>
                <Select
                    placeholder="Период"
                    options={[
                        { value: 'С', label: 'Семестр' },
                        { value: 'ПС', label: 'Полусеместр' },
                        { value: 'М', label: 'Месяц' },
                    ]}
                />
            </Form.Item>
            <Form.Item name="schedule_id" label="Последняя пара периода" rules={[REQUIRED_RULE]}>
                <Select
                    placeholder="Последняя пара периода"
                    loading={isParamsFetching}
                    options={uniqueParams?.map((param) => ({
                        key: param.id,
                        value: param.schedule.id,
                        label: formatDate(param.schedule.date),
                    }))}
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
