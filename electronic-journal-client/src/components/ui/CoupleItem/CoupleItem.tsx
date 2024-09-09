import { FC } from 'react';
import { ScheduleParam } from '@/types/schedule.types.ts';
import { Button, Flex, Typography } from 'antd';
import { ScheduleParamItem } from '@/components/ui/ScheduleParamItem/ScheduleParamItem.tsx';
import { PlusOutlined } from '@ant-design/icons';
import style from './CoupleItem.module.css';

const { Text } = Typography;

interface Props {
    number: number;
    params: ScheduleParam[];
    onParamUpdate?: (param: ScheduleParam) => void;
    onParamCreate?: (number: number) => void;
}

export const CoupleItem: FC<Props> = ({ number, params, onParamUpdate, onParamCreate }) => {
    return (
        <Flex gap={10} align="center" className={style.couple}>
            <Flex gap={10} align="center" className={style.content}>
                <Text type="secondary">{number}</Text>
                <Flex vertical className={style.params}>
                    {params.map((param) => (
                        <ScheduleParamItem key={param.id} param={param} onClick={onParamUpdate} />
                    ))}
                </Flex>
            </Flex>
            <Flex className={style.actions}>
                <Button
                    size="small"
                    icon={<PlusOutlined />}
                    type="dashed"
                    onClick={() => onParamCreate?.(number)}
                />
            </Flex>
        </Flex>
    );
};
