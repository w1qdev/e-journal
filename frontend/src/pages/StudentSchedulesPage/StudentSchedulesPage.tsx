import { Card, Col, Empty, Flex, Row, Space, Tag, Typography } from 'antd';
import { useGetSchedulesByGroupQuery } from '@/api/schedule.api.ts';
import { useAppSelector } from '@/hooks/use-store.ts';
import { selectUser } from '@/store/features/user/user.selectors.ts';
import { StudentScheduleTable } from '@/components/tables/StudentScheduleTable/StudentScheduleTable.tsx';
import dayjs from 'dayjs';

const { Text } = Typography;

export const StudentSchedulesPage = () => {
    const user = useAppSelector(selectUser);
    const { data, isFetching } = useGetSchedulesByGroupQuery(user?.group?.id!);
    const schedules = data?.schedule;

    return (
        <Card title="Расписание" loading={isFetching}>
            <Row gutter={[40, 40]} wrap>
                {!schedules?.length && <Empty description="Расписание не найдено" />}

                {schedules?.map((schedule) => (
                    <Col xs={24} md={12}>
                        <Flex vertical gap={10}>
                            <Space>
                                <Text strong>{schedule.date}</Text>
                                <Text type="secondary">— {schedule.day}</Text>
                                {schedule.date === dayjs().format('DD.MM.YYYY') && (
                                    <Tag color="var(--accent)">Сегодня</Tag>
                                )}
                            </Space>
                            <StudentScheduleTable key={schedule.day} lessons={schedule.lessons} />
                        </Flex>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};
