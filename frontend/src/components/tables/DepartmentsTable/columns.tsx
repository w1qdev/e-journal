import { ColumnsType } from 'antd/es/table';
import { Department } from '@/types/department.types.ts';
import { Button, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getColumnSearch } from '@/utils/get-column-search.tsx';

export const getDepartmentColumns = (
    onUpdate?: (department: Department) => void,
    onRemove?: (department: Department) => void,
) => {
    return [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Название',
            ...getColumnSearch('name', 'Поиск по названию'),
        },
        {
            key: 'president',
            render: (_, record) => record.president.fullname,
            title: 'Председатель',
            ...getColumnSearch('president.fullname', 'Поиск по председателю'),
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
    ] as ColumnsType<Department & { key: unknown }>;
};
