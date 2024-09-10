import { Card } from 'antd';
import { Group } from '@/types/group.types.ts';
import { FC } from 'react';
import { ScheduleParam } from '@/types/schedule.types.ts';
import { CoupleItem } from '@/components/ui/CoupleItem/CoupleItem.tsx';

interface Props {
    group: Group;
    params: ScheduleParam[];
    onParamCreate?: (group: Group, number: number) => void;
    onParamUpdate?: (param: ScheduleParam) => void;
}

const couples = [1, 2, 3, 4, 5, 6];

export const ScheduleCard: FC<Props> = ({ group, params, onParamCreate, onParamUpdate }) => {
    return (
        <Card title={group.name}>
            {couples.map((couple) => (
                <CoupleItem
                    key={couple}
                    number={couple}
                    params={params.filter((i) => i.number === couple)}
                    onParamUpdate={onParamUpdate}
                    onParamCreate={(number) => onParamCreate?.(group, number)}
                />
            ))}
        </Card>
    );
};
