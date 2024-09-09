import { Button, Descriptions, Form, Input, Select } from 'antd';
import { useCreateUserMutation } from '@/api/user.api.ts';
import { FC, useState } from 'react';
import { modal } from '@/utils/ant-context.ts';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { useGetRolesQuery } from '@/api/role.api.ts';
import { useSelect } from '@/hooks/use-select.ts';
import { Role } from '@/types/role.types.ts';
import { useGetGroupsQuery } from '@/api/group.api.ts';
import { selectSearch } from '@/constants/select-search.ts';

interface UserCreateFormData {
    last_name: string;
    first_name: string;
    surname?: string;
    email: string;
    role_id: number;
    group_id?: number;
}

interface Props {
    onCreated?: () => void;
}

export const UserCreateForm: FC<Props> = ({ onCreated }) => {
    const [createUser, { isLoading }] = useCreateUserMutation();
    const [role, setRole] = useState<Role>();

    const { data: roles, isLoading: isRolesLoading } = useGetRolesQuery(null);
    const rolesOptions = useSelect(roles || [], 'id', 'name');

    const { data: groups, isLoading: isGroupsLoading } = useGetGroupsQuery(null, {
        skip: role?.slug !== 'STUDENT',
    });
    const groupsOptions = useSelect(groups || [], 'id', 'name');

    const onFinish = async (formData: UserCreateFormData) => {
        const { username, password } = await createUser(formData).unwrap();

        modal.info({
            title: 'Данные для входа',
            content: (
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Логин">{username}</Descriptions.Item>
                    <Descriptions.Item label="Пароль">{password}</Descriptions.Item>
                </Descriptions>
            ),
            maskClosable: false,
            centered: true,
        });

        onCreated?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
        >
            <Form.Item name="last_name" label="Фамилия" rules={[REQUIRED_RULE]}>
                <Input placeholder={'Фамилия'}/>
            </Form.Item>
            <Form.Item name="first_name" label="Имя" rules={[REQUIRED_RULE]}>
                <Input placeholder={'Имя'}/>
            </Form.Item>
            <Form.Item name="surname" label="Отчество">
                <Input placeholder={'Отчество'}/>
            </Form.Item>
            <Form.Item name="email" label="Почта">
                <Input placeholder={'Почта'}/>
            </Form.Item>
            <Form.Item name="role_id" label="Роль" rules={[REQUIRED_RULE]}>
                <Select
                    options={rolesOptions}
                    loading={isRolesLoading}
                    onChange={(value) => setRole(roles?.find((role) => role.id === value))}
                    {...selectSearch}
                    placeholder={'Роль'}
                />
            </Form.Item>
            {role?.slug === 'STUDENT' && (
                <Form.Item name="group_id" label="Группа" rules={[REQUIRED_RULE]}>
                    <Select options={groupsOptions} loading={isGroupsLoading} {...selectSearch}
                            placeholder={'Группа'}/>
                </Form.Item>
            )}
            <Form.Item style={{ display: 'flex', justifyContent: 'right' }}>
                <Button htmlType="submit" loading={isLoading} type="primary">
                    Создать
                </Button>
            </Form.Item>
        </Form>
    );
};
