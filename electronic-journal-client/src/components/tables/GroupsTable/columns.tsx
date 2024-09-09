import { ColumnsType } from 'antd/es/table';
import { Group } from '@/types/group.types.ts';
import { Button, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getColumnSearch } from '@/utils/get-column-search.tsx';

export const getGroupColumns = (
    onUpdate?: (group: Group) => void,
    onRemove?: (group: Group) => void,
) => {
    return [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Название',
            ...getColumnSearch('name', 'Поиск по названию'),
        },
        {
            key: 'course',
            dataIndex: 'course',
            title: 'Курс',
            width: 100,
            ...getColumnSearch('course', 'Поиск по курсу'),
        },
        {
            key: 'profession',
            render: (_, record) => record.profession.name,
            title: 'Специальность',
            ...getColumnSearch('profession.name', 'Поиск по специальности'),
        },
        {
            key: 'subjects',
            render: (_, record) =>
                record.subjects.map((sub) => (
                    <div key={sub.id}>
                        {sub.name} {sub.teacher && '- ' + sub.teacher.fullname}
                    </div>
                )),
            title: 'Предметы',
        },
        {
            key: 'tutor',
            render: (_, record) => record.tutor?.fullname,
            title: 'Куратор',
            ...getColumnSearch('tutor.fullname', 'Поиск по куратору'),
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
    ] as ColumnsType<Group & { key: unknown }>;
};
