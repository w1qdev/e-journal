import { Card, Col, Input, Row, Skeleton, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useGetScheduleByIdQuery } from '@/api/schedule.api.ts';
import { formatDate } from '@/utils/format-date.ts';
import { useGetGroupsQuery } from '@/api/group.api.ts';
import { ScheduleCard } from '@/components/ui/ScheduleCard/ScheduleCard.tsx';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { ScheduleParamCreateForm } from '@/components/forms/schedule-param/ScheduleParamCreateForm/ScheduleParamCreateForm.tsx';
import { Group } from '@/types/group.types.ts';
import { useState } from 'react';
import { ScheduleParamUpdateForm } from '@/components/forms/schedule-param/ScheduleParamUpdateForm/ScheduleParamUpdateForm.tsx';
import { ScheduleParam } from '@/types/schedule.types.ts';

export const SchedulePage = () => {
    const { scheduleId } = useParams();
    const { data: schedule, isFetching: isScheduleLoading } = useGetScheduleByIdQuery(+scheduleId!);
    const { data: groups, isFetching: isGroupsLoading } = useGetGroupsQuery(null);

    const isLoading = isScheduleLoading || isGroupsLoading;

    const [createModalOpen, openCreateModal, closeCreateModal] = useModal();
    const [group, setGroup] = useState<Group>();
    const [number, setNumber] = useState<number>();

    const [updateModalOpen, openUpdateModal, closeUpdateModal] = useModal();
    const [param, setParam] = useState<ScheduleParam>();

    const [search, setSearch] = useState<string>('');

    const onParamCreateHandler = (group: Group, number: number) => {
        setGroup(group);
        setNumber(number);
        openCreateModal();
    };

    const onParamUpdateHandler = (param: ScheduleParam) => {
        setParam(param);
        openUpdateModal();
    };

    return (
        <Card
            title={isLoading ? <Skeleton.Input /> : `Расписание на ${formatDate(schedule?.date)}`}
            extra={
                <Input.Search
                    placeholder="Поиск по группам"
                    onSearch={(value) => setSearch(value)}
                />
            }
        >
            <Spin spinning={isLoading}>
                <Row gutter={[20, 20]} wrap>
                {groups
                    ?.filter((group) => group.name.toLowerCase().includes(search.toLowerCase()))
                    .sort((a, b) => a.name.charAt(1).localeCompare(b.name.charAt(1))) // сортировка по второму символу
                    .map((group) => {
                        const params = schedule?.params.filter((i) => i.group.id === group.id) || [];

                        return (
                        <Col xs={6} key={group.id}>
                            <ScheduleCard
                            group={group}
                            params={params}
                            onParamCreate={onParamCreateHandler}
                            onParamUpdate={onParamUpdateHandler}
                            />
                        </Col>
                        );
                    })}
                </Row>
            </Spin>

            <ModalRaw
                title={`Редактирование ${param?.number} пары для группы ${param?.group.name}`}
                open={updateModalOpen}
                onCancel={closeUpdateModal}
                width={600}
            >
                <ScheduleParamUpdateForm
                    param={param}
                    onComplete={closeUpdateModal}
                    openFrom={'SCHEDULE'}
                />
            </ModalRaw>

            <ModalRaw
                title={`Создание ${number} пары для группы ${group?.name}`}
                open={createModalOpen}
                onCancel={closeCreateModal}
                width={600}
            >
                <ScheduleParamCreateForm
                    schedule_id={+scheduleId!}
                    group_id={group?.id}
                    number={number}
                    onCreated={closeCreateModal}
                />
            </ModalRaw>
        </Card>
    );
};
