import { FC, ReactNode, useMemo } from 'react';
import { JournalTableData } from '@/components/tables/JournalTable/columns.tsx';
import styles from './nigger.module.css';

export interface RateCellProps {
    children: ReactNode;
    record?: JournalTableData;
    dataIndex?: string;
    fixed?: boolean;
    onCreateRate?: () => void;
    onUpdateRate?: () => void;
}

const colors: Record<string, string> = {
    '1': styles.one,
    '2': styles.two,
    '3': styles.three,
    '4': styles.four,
    '5': styles.five,
};

const getColorClass = (rate: string) => {
    const classname = colors[rate];
    return classname ? classname : styles.other;
};

export const RateCell: FC<RateCellProps> = ({
    record,
    dataIndex,
    fixed,
    onCreateRate,
    onUpdateRate,
    ...props
}) => {
    const rate = useMemo(() => {
        if (!record || !dataIndex) return null;
        return record[dataIndex as any] as string;
    }, [record, dataIndex]);

    const isAction = rate ? !!onUpdateRate : !!onCreateRate;

    const classes = [
        styles.cell,
        rate ? getColorClass(rate) : '',
        fixed ? styles.sticky : styles.static,
        isAction ? styles.action : '',
    ];

    return (
        <td {...props} className={classes.join(' ')} onClick={rate ? onUpdateRate : onCreateRate} />
    );
};
