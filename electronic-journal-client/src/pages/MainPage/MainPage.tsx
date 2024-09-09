import { Avatar, Card, Col, Flex, Row, Typography } from 'antd';
import { MAIN_MENU } from '@/constants/main-menu.tsx';
import { useAppSelector } from '@/hooks/use-store.ts';
import { selectUserRole } from '@/store/features/user/user.selectors.ts';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const MainPage = () => {
    const userRole = useAppSelector(selectUserRole);
    const navigate = useNavigate();
    const menu = MAIN_MENU.filter((item) => item.roles?.includes(userRole!.slug));

    return (
        <Card title="Навигация">
            <Row gutter={[20, 20]}>
                {menu.map((item) => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={item.key}>
                        <Card hoverable onClick={() => navigate(item.link)}>
                            <Flex gap={20} align="center">
                                <Avatar icon={item.icon} style={{ background: item.color }} />
                                <Text>{item.label}</Text>
                            </Flex>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};
