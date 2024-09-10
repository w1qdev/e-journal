import { FC, ReactNode } from 'react';
import { useAppSelector } from '@/hooks/use-store.ts';
import { selectUserRole } from '@/store/features/user/user.selectors.ts';
import { Navigate } from 'react-router-dom';
import { RoleSlugs } from '@/types/role.types.ts';

interface Props {
    roles: RoleSlugs[];
    children?: ReactNode;
}

export const RoleRequired: FC<Props> = ({ roles, children }) => {
    const userRole = useAppSelector(selectUserRole);
    if (!userRole) return null;
    return roles.includes(userRole.slug) ? children : <Navigate to="/" />;
};
