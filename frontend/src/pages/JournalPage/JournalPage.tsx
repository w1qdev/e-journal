import { Button, Card, Empty, Select, Space } from 'antd';
import { useGetGroupsQuery } from '@/api/group.api.ts';
import { useSelect } from '@/hooks/use-select.ts';
import { selectSearch } from '@/constants/select-search.ts';
import { useSelectSubjects } from '@/hooks/use-select-subjects.ts';
import { useEffect, useState } from 'react';
import { JournalTable } from '@/components/tables/JournalTable/JournalTable.tsx';
import { Group } from '@/types/group.types.ts';
import { Subject } from '@/types/subject.types.ts';
import { useAppSelector } from '@/hooks/use-store.ts';
import { selectUser, selectUserRole } from '@/store/features/user/user.selectors.ts';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { AttestationCreateForm } from '@/components/forms/attestation/AttestationCreateForm/AttestationCreateForm.tsx';

export const JournalPage = () => {
    const user = useAppSelector(selectUser);
    const role = useAppSelector(selectUserRole);

    const [createModalOpen, openCreateModal, closeCreateModal] = useModal();

    const [group, setGroup] = useState<Group>();
    const [subject, setSubject] = useState<Subject>();
    const [lesson, setLesson] = useState<'ALL' | 'PRACTICE' | 'LECTURE' | 'LAB_WORK' | 'SELF_WORK'>('ALL');

    const { data: groups, isFetching: isGroupLoading } = useGetGroupsQuery(null);
    const groupsOptions = useSelect(groups || [], 'id', 'name');
    const subjectsOptions = useSelectSubjects(group?.subjects || []);

    useEffect(() => {
        if (!groups || role?.slug !== 'STUDENT') return;
        setGroup(groups.find((i) => i.id === user?.group?.id));
    }, [groups]);

    return (
        <Card
            title="Журнал"
            headStyle={{ overflow: 'auto' }}
            extra={
                <Space>
                    {group &&
                        subject &&
                        ((!subject.teacher && role?.slug === 'TEACHER') ||
                            subject.teacher?.id === user?.id ||
                            role?.slug === 'ADMIN') && (
                            <Button type="primary" onClick={openCreateModal}>
                                Аттестация
                            </Button>
                        )}

                    <Select
                        value={group?.id}
                        options={
                            user?.id === 584
                                ? groupsOptions.filter((group) => group.label === '3АС1')
                                : groupsOptions
                        }
                        loading={isGroupLoading}
                        onChange={(id) => {
                            setGroup(groups?.find((i) => i.id === id));
                            setSubject(undefined);
                        }}
                        disabled={role?.slug === 'STUDENT'}
                        placeholder="Выберите группу"
                        {...selectSearch}
                    />

                    <Select
                        value={subject?.id}
                        options={
                            user?.id === 584
                                ? subjectsOptions.filter(
                                    (subject) => subject.label === 'ТООиВТОиСАЭ  - Сергеев М. И.',
                                )
                                : subjectsOptions
                        }
                        disabled={!group}
                        placeholder="Выберите предмет"
                        onChange={(id) => setSubject(group?.subjects.find((i) => i.id === id))}
                        style={{ minWidth: 250 }}
                        {...selectSearch}
                    />

                    <Select
                        value={lesson}
                        style={{ minWidth: 120 }}
                        options={[
                            { value: 'ALL', label: 'Все' },
                            { value: 'LECTURE', label: 'Лекции' },
                            { value: 'PRACTICE', label: 'Практики' },
                            { value: 'LAB_WORK', label: 'Лаб. работы' },
                            { value: 'SELF_WORK', label: 'Сам. работы' },
                        ]}
                        onChange={(value) => setLesson(value)}
                    />
                </Space>
            }
        >
            {group && subject ? (
                <JournalTable group={group} subject={subject} lesson={lesson} />
            ) : (
                <Empty description="Выберите группу и предмет" />
            )}

            <ModalRaw
                title="Аттестация"
                open={createModalOpen}
                onCancel={closeCreateModal}
                width={600}
            >
                <AttestationCreateForm
                    group={group}
                    subject={subject}
                    onCreated={closeCreateModal}
                />
            </ModalRaw>
        </Card>
    );
};
