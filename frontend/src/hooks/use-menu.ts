import { createElement, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MenuItem } from '@/types/menu.types.ts';
import { useAppSelector } from '@/hooks/use-store.ts';
import { selectUserRole } from '@/store/features/user/user.selectors.ts';

const isPathStartsWithLocation = (path: string, location: string) => {
    const pathParts = path.split('/');
    const locationParts = location.split('/');

    if (pathParts.length < locationParts.length) return false;

    for (let i = 0; i < locationParts.length; i++) {
        if (locationParts[i] !== '*' && pathParts[i] !== locationParts[i]) {
            return false;
        }
    }

    return true;
};

export const useMenu = (menuList: Menu[]): [MenuItem[], string[]] => {
    const location = useLocation();
    const userRole = useAppSelector(selectUserRole);

    const getMenu = () => {
        let items = menuList;

        if (userRole) {
            items = items.filter((item) => item.roles?.includes(userRole.slug));
        }

        return items.map((item) => ({
            key: item.key,
            label: createElement(Link, { to: item.link, children: item.label }),
            icon: item.icon,
        })) as MenuItem[];
    };

    const getSelectedItems = () => {
        const items = menuList.filter((item) => {
            for (const itemLocation of item.locations || []) {
                if (isPathStartsWithLocation(location.pathname, itemLocation)) {
                    return true;
                }
            }

            return false;
        });

        return items.map((item) => item.key);
    };

    const menu = useMemo(getMenu, [userRole, menuList]);
    const selectedItems = useMemo(getSelectedItems, [location, menuList]);

    return [menu, selectedItems];
};
