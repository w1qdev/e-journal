import { Schedule } from '@/types/schedule.types.ts';
import { ColumnsType } from 'antd/es/table';
import { Button, Space, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const opacity = 0.5;

export const getSchedulesColumns = (
    onUpdate?: (schedule: Schedule) => void,
    onRemove?: (schedule: Schedule) => void,
    onVisibleChange?: (schedule: Schedule) => void,
) => {
    return [
        {
            key: 'date',
            render: (_, record) => (
                <Link
                    to={`/manage-schedule/${record.id}`}
                    style={{ opacity: !record.visible ? opacity : 1 }}
                >
                    {dayjs(record.date).format('DD.MM.YYYY')}
                </Link>
            ),
            title: 'Дата',
        },
        {
            key: 'visible',
            render: (_, record) => (
                <Tag
                    color={record.visible ? '#108ee9' : '#f50'}
                    style={{ opacity: !record.visible ? opacity : 1 }}
                >
                    {record.visible ? 'Активно' : 'Скрыто'}
                </Tag>
            ),
            title: 'Состояние',
            filters: [
                {
                    text: 'Активно',
                    value: true,
                },
                {
                    text: 'Скрыто',
                    value: false,
                },
            ],
            onFilter: (value: boolean, record) => record.visible === value,
            width: 1,
        },
        {
            key: 'actions',
            render: (_, record) => (
                <Space style={{ opacity: !record.visible ? opacity : 1 }}>
                    <Tooltip title={record.visible ? 'Скрыть' : 'Показать'}>
                        <Button
                            type="default"
                            icon={record.visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            onClick={() => onVisibleChange?.(record)}
                        />
                    </Tooltip>

                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => onUpdate?.(record)}
                    />

                    <Button
                        type="primary"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => onRemove?.(record)}
                    />
                </Space>
            ),
            width: 1,
        },
    ] as ColumnsType<Schedule & { key: unknown }>;
};
