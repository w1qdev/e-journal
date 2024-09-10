import { useAppSelector } from '@/hooks/use-store.ts';
import { selectIsAuth } from '@/store/features/user/user.selectors.ts';
import { Navigate } from 'react-router-dom';
import { FC, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

export const AuthNonRequired: FC<Props> = ({ children }) => {
    const isAuth = useAppSelector(selectIsAuth);
    return !isAuth ? children : <Navigate to="/" />;
};
