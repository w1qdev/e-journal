import { MenuProps } from 'antd';
import { ReactNode } from 'react';
import { RoleSlugs } from '@/types/role.types.ts';

export type MenuItem = Required<MenuProps>['items'][number];

export interface Menu {
    key: string;
    link: string;
    label: ReactNode;
    icon?: ReactNode;
    locations?: string[];
    roles?: RoleSlugs[];
    color?: string;
}
