import { FC, ReactNode, useMemo } from 'react';
import { ReportTableData } from '@/components/tables/ReportTable/columns.tsx';
import styles from './nigger.module.css';

export interface ReportCellProps {
    children: ReactNode;
    record?: ReportTableData;
    dataIndex?: string;
    fixed?: boolean;
    onCreateReportValue?: () => void;
    onUpdateReportValue?: () => void;
}

export const ReportCell: FC<ReportCellProps> = ({
    record,
    dataIndex,
    fixed,
    onCreateReportValue,
    onUpdateReportValue,
    ...props
}) => {
    const value = useMemo(() => {
        if (!record || !dataIndex) return null;
        return record[dataIndex as any];
    }, [record, dataIndex]);

    const isAction = value ? !!onUpdateReportValue : !!onCreateReportValue;

    const classes = [
        styles.cell,
        fixed ? styles.sticky : styles.static,
        isAction ? styles.action : '',
    ];

    return (
        <td
            {...props}
            className={classes.join(' ')}
            onClick={value ? onUpdateReportValue : onCreateReportValue}
        />
    );
};
