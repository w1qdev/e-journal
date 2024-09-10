import { User } from '@/types/user.types.ts';
import { ColumnsType } from 'antd/es/table';
import { Button, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getColumnSearch } from '@/utils/get-column-search.tsx';

export const getUserColumns = (
    onUpdate?: (user: User) => void,
    onRemove?: (user: User) => void,
) => {
    return [
        {
            key: 'full_name',
            dataIndex: 'full_name',
            title: 'ФИО',
            ...getColumnSearch('full_name', 'Поиск по ФИО'),
        },
        {
            key: 'username',
            dataIndex: 'username',
            title: 'Логин',
            ...getColumnSearch('username', 'Поиск по логину'),
        },
        {
            key: 'email',
            dataIndex: 'email',
            title: 'Почта',
            ...getColumnSearch('email', 'Поиск по почте'),
        },
        {
            key: 'role',
            render: (_, record) => record.role.name,
            title: 'Роль',
            filters: [
                { text: 'Администратор', value: 'ADMIN' },
                { text: 'Преподаватель', value: 'TEACHER' },
                { text: 'Студент', value: 'STUDENT' },
                { text: 'Составитель расписания', value: 'SCHEDULE_CREATOR' },
            ],
            onFilter: (value: any, record) => {
                return record.role.slug === value;
            },
        },
        {
            key: 'group',
            render: (_, record) => record.group?.name,
            title: 'Группа',
            ...getColumnSearch('group.name', 'Поиск по группе'),
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
    ] as ColumnsType<User & { key: unknown }>;
};
