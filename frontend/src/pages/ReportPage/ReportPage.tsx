import { Card, DatePicker, Empty, Select, Space } from 'antd';
import { ReportTable } from '@/components/tables/ReportTable/ReportTable.tsx';
import { useGetGroupsQuery } from '@/api/group.api.ts';
import { useSelect } from '@/hooks/use-select.ts';
import { selectSearch } from '@/constants/select-search.ts';
import { useEffect, useState } from 'react';
import { Group } from '@/types/group.types.ts';
import { useAppSelector } from '@/hooks/use-store.ts';
import { selectUser, selectUserRole } from '@/store/features/user/user.selectors.ts';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export const ReportPage = () => {
    const user = useAppSelector(selectUser);
    const role = useAppSelector(selectUserRole);

    const [group, setGroup] = useState<Group>();

    const { data: groups, isFetching: isGroupLoading } = useGetGroupsQuery(null);
    const groupsOptions = useSelect(groups || [], 'id', 'name');

    const [range, setRange] = useState<{ from: string; to: string }>({
        from: dayjs().subtract(1, 'day').format('DD.MM.YYYY'),
        to: dayjs().add(6, 'day').format('DD.MM.YYYY'),
    });

    useEffect(() => {
        if (!groups || role?.slug !== 'STUDENT') return;
        setGroup(groups.find((i) => i.id === user?.group?.id));
    }, [groups]);

    return (
        <Card
            title="Рапортичка"
            headStyle={{ overflow: 'auto' }}
            extra={
                <Space>
                    <Select
                        value={group?.id}
                        options={groupsOptions}
                        loading={isGroupLoading}
                        onChange={(id) => {
                            setGroup(groups?.find((i) => i.id === id));
                        }}
                        disabled={role?.slug === 'STUDENT'}
                        placeholder="Выберите группу"
                        {...selectSearch}
                    />
                    <RangePicker
                        allowEmpty={[false, false]}
                        format={'DD.MM.YYYY'}
                        style={{ minWidth: 250 }}
                        value={[dayjs(range.from, 'DD.MM.YYYY'), dayjs(range.to, 'DD.MM.YYYY')]}
                        onChange={(_, format) => {
                            if (!format || !format[0] || !format[1]) return;
                            setRange({
                                from: format[0],
                                to: format[1],
                            });
                        }}
                    />
                </Space>
            }
        >
            {group ? (
                <ReportTable group={group} dateFrom={range.from} dateTo={range.to} />
            ) : (
                <Empty description="Выберите группу" />
            )}
        </Card>
    );
};
