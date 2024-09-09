import {
    useAddGroupSubjectMutation,
    useRemoveGroupSubjectMutation,
    useUpdateGroupMutation,
} from '@/api/group.api.ts';
import { useGetUsersByRolesQuery } from '@/api/user.api.ts';
import { useSelect } from '@/hooks/use-select.ts';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { Group } from '@/types/group.types.ts';
import { FC } from 'react';
import { useGetSubjectsQuery } from '@/api/subject.api.ts';
import { useGetProfessionsQuery } from '@/api/profession.api.ts';
import { useSelectSubjects } from '@/hooks/use-select-subjects.ts';
import { selectSearch } from '@/constants/select-search.ts';

interface GroupUpdateFormData {
    name: string;
    course: number;
    profession_id: number;
    tutor_id: number;
}

interface Props {
    group?: Group;
    onUpdated?: () => void;
}

export const GroupUpdateForm: FC<Props> = ({ group, onUpdated }) => {
    const [updateGroup, { isLoading: isCreating }] = useUpdateGroupMutation();
    const [addSubject, { isLoading: isAddingSubject }] = useAddGroupSubjectMutation();
    const [removeSubject, { isLoading: isRemovingSubject }] = useRemoveGroupSubjectMutation();

    const { data: tutors, isLoading: isTutorsLoading } = useGetUsersByRolesQuery([
        'TEACHER',
        'ADMIN',
        'SCHEDULE_CREATOR',
    ]);
    const teachersOptions = useSelect(tutors || [], 'id', 'full_name');

    const { data: profession, isLoading: isProfessionsLoading } = useGetProfessionsQuery(null);
    const professionsOptions = useSelect(profession || [], 'id', 'name');

    const { data: subjects, isLoading: isSubjectsLoading } = useGetSubjectsQuery(null);
    const subjectsOptions = useSelectSubjects(subjects || []);

    const onFinish = async (data: GroupUpdateFormData) => {
        if (!group) return;
        await updateGroup({ group_id: group.id, ...data });
        onUpdated?.();
    };

    const onSelectHandler = (value: number) => {
        if (!group) return;
        addSubject({
            group_id: group.id,
            subject_id: value,
        });
    };

    const onDeselectHandler = (value: number) => {
        if (!group) return;
        removeSubject({
            group_id: group.id,
            subject_id: value,
        });
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
            initialValues={{
                name: group?.name,
                course: group?.course,
                profession_id: group?.profession.id,
                tutor_id: group?.tutor?.id,
            }}
        >
            <Form.Item name="name" label="Название" rules={[REQUIRED_RULE]}>
                <Input placeholder="Название" />
            </Form.Item>
            <Form.Item name="course" label="Курс" rules={[REQUIRED_RULE]}>
                <InputNumber min={1} max={4} placeholder="4" style={{ width: '100%' }} />
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
            <Form.Item label="Предметы">
                <Select
                    options={subjectsOptions}
                    loading={isSubjectsLoading}
                    mode="multiple"
                    defaultValue={group?.subjects.map((sub) => sub.id)}
                    onSelect={onSelectHandler}
                    onDeselect={onDeselectHandler}
                    disabled={isAddingSubject || isRemovingSubject}
                    {...selectSearch}
                    placeholder={'Предметы'}
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
