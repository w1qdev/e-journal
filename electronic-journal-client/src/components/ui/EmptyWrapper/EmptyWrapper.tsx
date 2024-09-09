import { FC, ReactNode } from 'react';
import { Empty, Flex, Spin } from 'antd';

interface Props {
    empty: boolean;
    loading?: boolean;
    description?: string;
    children?: ReactNode;
}

export const EmptyWrapper: FC<Props> = ({
    empty,
    loading,
    description = 'Данные не найдены',
    children,
}) => {
    if (empty) {
        return (
            <Spin spinning={loading}>
                <Flex align="center" justify="center" style={{ width: '100%', height: '100%' }}>
                    <Empty description={description} />
                </Flex>
            </Spin>
        );
    }

    return <Spin spinning={loading}>{children}</Spin>;
};
