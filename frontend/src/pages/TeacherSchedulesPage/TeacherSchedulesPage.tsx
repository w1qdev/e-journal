import { Card, Col, DatePicker, Empty, Flex, Row, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useGetSchedulesByDateQuery } from '@/api/schedule.api.ts';
import { TeacherScheduleTable } from '@/components/tables/TeacherScheduleTable/TeacherScheduleTable.tsx';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export const TeacherSchedulesPage = () => {
    const [range, setRange] = useState<{ from: string; to: string }>({
        from: dayjs().subtract(1, 'day').format('DD.MM.YYYY'),
        to: dayjs().add(6, 'day').format('DD.MM.YYYY'),
    });
    const { data: schedules, isLoading } = useGetSchedulesByDateQuery(range!, { skip: !range });

    return (
        <Card
            title="Мое расписание"
            loading={isLoading}
            extra={
                <RangePicker
                    allowEmpty={[false, false]}
                    format={'DD.MM.YYYY'}
                    value={[dayjs(range.from, 'DD.MM.YYYY'), dayjs(range.to, 'DD.MM.YYYY')]}
                    onChange={(_, format) => {
                        if (!format || !format[0] || !format[1]) return;
                        setRange({
                            from: format[0],
                            to: format[1],
                        });
                    }}
                />
            }
        >
            {!schedules?.length && (
                <Empty description="Расписание на выбранный период не найдено" />
            )}

            <Row gutter={[40, 40]} wrap>
                {schedules?.map((schedule) => (
                    <Col xs={24} md={12} key={schedule.date}>
                        <Flex vertical gap={10}>
                            <Space>
                                <Text strong>{schedule.date}</Text>
                                <Text type="secondary">— {schedule.day}</Text>
                                {schedule.date === dayjs().format('DD.MM.YYYY') && (
                                    <Tag color="var(--accent)">Сегодня</Tag>
                                )}
                            </Space>
                            <TeacherScheduleTable lessons={schedule.lessons} />
                        </Flex>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};
