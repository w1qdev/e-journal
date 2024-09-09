import { useAppSelector } from '@/hooks/use-store.ts';
import { selectIsAuth } from '@/store/features/user/user.selectors.ts';
import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
    children?: ReactNode;
}

export const AuthRequired: FC<Props> = ({ children }) => {
    const isAuth = useAppSelector(selectIsAuth);
    return isAuth ? children : <Navigate to="/login" />;
};
