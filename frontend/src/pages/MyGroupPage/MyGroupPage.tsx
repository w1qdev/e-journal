import { Card, Col, Descriptions, Empty, Row } from 'antd';
import { useAppSelector } from '@/hooks/use-store.ts';
import { selectUser } from '@/store/features/user/user.selectors.ts';
import { useGetGroupByIdQuery } from '@/api/group.api.ts';

export const MyGroupPage = () => {
    const user = useAppSelector(selectUser);
    const { data: group, isFetching } = useGetGroupByIdQuery(user?.group?.id!);

    return (
        <Card title={`Моя группа ${group ? group.name : ''}`} loading={isFetching}>
            {group && (
                <Row gutter={20} align={group.subjects.length === 0 ? 'middle' : undefined}>
                    <Col xs={12}>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Группа">{group.name}</Descriptions.Item>
                            <Descriptions.Item label="Курс">{group.course}</Descriptions.Item>
                            <Descriptions.Item label="Специальность">
                                {group.profession.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Куратор">
                                {group.tutor?.fullname}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col xs={12}>
                        {group.subjects.length === 0 ? (
                            <Empty description="Предметы отсутствуют" />
                        ) : (
                            <Descriptions column={1} bordered>
                                {group.subjects.map((subject) => (
                                    <Descriptions.Item label={subject.slug}>
                                        {subject.teacher?.fullname}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        )}
                    </Col>
                </Row>
            )}
        </Card>
    );
};
