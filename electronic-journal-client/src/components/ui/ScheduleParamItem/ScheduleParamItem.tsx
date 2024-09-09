import { ScheduleParam } from '@/types/schedule.types.ts';
import { FC } from 'react';
import style from './ScheduleParamItem.module.css';
import { Divider, Flex, Tag, Tooltip } from 'antd';

interface Props {
    param: ScheduleParam;
    onClick?: (param: ScheduleParam) => void;
}

export const ScheduleParamItem: FC<Props> = ({ param, onClick }) => {
    return (
        <Tooltip title={param.subject.teacher?.fullname}>
            <Tag className={style.param} onClick={() => onClick?.(param)}>
                <Flex justify="space-between">
                    <div className={style.half}>
                        {param.first_half}
                        {param.first_half && <Divider type="vertical" />}
                    </div>
                    <div className={style.subject}>{param.subject.slug}</div>
                    <div className={style.office}>
                        <Divider type="vertical" />
                        {param.office} {param.sub_group && ` (${param.sub_group}пг)`}
                    </div>
                </Flex>
            </Tag>
        </Tooltip>
    );
};
