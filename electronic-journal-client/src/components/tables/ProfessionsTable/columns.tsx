import { Profession } from '@/types/profession.types.ts';
import { ColumnsType } from 'antd/es/table';
import { Button, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getColumnSearch } from '@/utils/get-column-search.tsx';

export const getProfessionColumns = (
    onUpdate?: (profession: Profession) => void,
    onRemove?: (profession: Profession) => void,
) => {
    return [
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
            ...getColumnSearch('slug', 'Поиск по краткому названию'),
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
    ] as ColumnsType<Profession & { key: unknown }>;
};
