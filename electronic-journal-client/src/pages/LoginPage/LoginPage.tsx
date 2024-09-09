import { Card } from 'antd';
import { LoginForm } from '@/components/forms/user/LoginForm/LoginForm.tsx';
import style from './LoginPage.module.css';

export const LoginPage = () => {
    return (
        <div className={style.login}>
            <Card title="Войдите в аккаунт" style={{ width: '100%' }}>
                <LoginForm />
            </Card>
        </div>
    );
};
