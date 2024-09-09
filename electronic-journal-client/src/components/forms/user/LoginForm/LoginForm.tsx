import { Button, Form, Input } from 'antd';
import { useLoginMutation } from '@/api/user.api.ts';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';

interface LoginFormData {
    username: string;
    password: string;
}

export const LoginForm = () => {
    const [login, { isLoading: loginLoading }] = useLoginMutation();

    const onFinish = async (data: LoginFormData) => {
        try {
            await login(data).unwrap();
        } catch (e) {
            /* */
        }
    };

    return (
        <Form size="large" onFinish={onFinish}>
            <Form.Item name="username" rules={[REQUIRED_RULE]}>
                <Input placeholder="Логин" />
            </Form.Item>
            <Form.Item name="password" rules={[REQUIRED_RULE]}>
                <Input.Password placeholder="Пароль" />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary" block loading={loginLoading}>
                    Продолжить
                </Button>
            </Form.Item>
        </Form>
    );
};
