import { Subject } from '@/types/subject.types.ts';
import { Button, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { getColumnSearch } from '@/utils/get-column-search.tsx';

export const getSubjectColumns = (
    onUpdate?: (subject: Subject) => void,
    onRemove?: (subject: Subject) => void,
) => {
    return [
        {
            key: 'code',
            dataIndex: 'code',
            title: 'Код',
            ...getColumnSearch('code', 'Поиск по коду'),
        },
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Название',
            ...getColumnSearch('name', 'Поиск по названию'),
        },
        {
            key: 'slug',
            dataIndex: 'slug',
            title: 'Краткое название',
            ...getColumnSearch('name', 'Поиск по краткому названию'),
        },
        {
            key: 'teacher',
            render: (_, record) => record.teacher?.fullname,
            title: 'Преподаватель',
            ...getColumnSearch('teacher.fullname', 'Поиск по преподавателю'),
        },
        {
            key: 'actions',
            render: (_, record) => (
                <Space>
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
    ] as ColumnsType<Subject & { key: unknown }>;
};
