import { Button, Descriptions, Form, Input, Select } from 'antd';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';
import { useGetRolesQuery } from '@/api/role.api.ts';
import { useSelect } from '@/hooks/use-select.ts';
import { useResetUserPasswordMutation, useUpdateUserMutation } from '@/api/user.api.ts';
import { User } from '@/types/user.types.ts';
import { FC, useState } from 'react';
import { modal } from '@/utils/ant-context.ts';
import { Role } from '@/types/role.types.ts';
import { useGetGroupsQuery } from '@/api/group.api.ts';
import { selectSearch } from '@/constants/select-search.ts';

interface UserUpdateFormData {
    lastname: string;
    firstname: string;
    surname?: string;
    email: string;
    role_id: number;
    group_id?: number;
}

interface Props {
    user?: User;
    onComplete?: () => void;
}

export const UserUpdateForm: FC<Props> = ({ user, onComplete }) => {
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [resetUserPassword, { isLoading: isResetting }] = useResetUserPasswordMutation();
    const [role, setRole] = useState<Role | undefined>(user?.role);

    const { data: roles, isLoading: isRolesLoading } = useGetRolesQuery(null);
    const rolesOptions = useSelect(roles || [], 'id', 'name');

    const { data: groups, isLoading: isGroupsLoading } = useGetGroupsQuery(null, {
        skip: role?.slug !== 'STUDENT',
    });
    const groupsOptions = useSelect(groups || [], 'id', 'name');

    const onFinish = async (data: UserUpdateFormData) => {
        if (!user) return;
        await updateUser({ user_id: user.id, ...data });
        onComplete?.();
    };

    const onResetPassword = async () => {
        if (!user) return;
        const { password } = await resetUserPassword(user.id).unwrap();

        modal.info({
            title: 'Новые данные для входа',
            content: (
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Логин">{user.username}</Descriptions.Item>
                    <Descriptions.Item label="Пароль">{password}</Descriptions.Item>
                </Descriptions>
            ),
            maskClosable: false,
            centered: true,
        });

        onComplete?.();
    };

    return (
        <Form
            colon={false}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
            initialValues={{
                firstname: user?.first_name,
                lastname: user?.last_name,
                surname: user?.surname,
                email: user?.email,
                role_id: user?.role.id,
                group_id: user?.group?.id,
            }}
        >
            <Form.Item name="lastname" label="Фамилия" rules={[REQUIRED_RULE]}>
                <Input placeholder={'Фамилия'}/>
            </Form.Item>
            <Form.Item name="firstname" label="Имя" rules={[REQUIRED_RULE]}>
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
                    placeholder={'Фамилия'}
                />
            </Form.Item>
            {role?.slug === 'STUDENT' && (
                <Form.Item name="group_id" label="Группа" rules={[REQUIRED_RULE]}>
                    <Select options={groupsOptions} loading={isGroupsLoading} {...selectSearch}
                            placeholder={'Фамилия'}/>
                </Form.Item>
            )}
            <Form.Item label=" ">
                <Button type="dashed" block onClick={onResetPassword} loading={isResetting}>
                    Сбросить пароль
                </Button>
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'right' }}>
                <Button htmlType="submit" loading={isLoading} type="primary">
                    Сохранить
                </Button>
            </Form.Item>
        </Form>
    );
};
