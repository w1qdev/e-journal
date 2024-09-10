import { Dropdown, Layout, Menu, MenuProps, Typography } from 'antd';
import { FC, ReactNode } from 'react';
import style from './AppLayout.module.css';
import { useMenu } from '@/hooks/use-menu.ts';
import { MAIN_MENU } from '@/constants/main-menu.tsx';
import { useAppDispatch, useAppSelector } from '@/hooks/use-store.ts';
import { selectUser } from '@/store/features/user/user.selectors.ts';
import { useLogoutMutation } from '@/api/user.api.ts';
import {
    BgColorsOutlined,
    CompressOutlined,
    DownOutlined,
    KeyOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { selectCompact, selectTheme } from '@/store/features/theme/theme.selectros.ts';
import { themeActions } from '@/store/features/theme/theme.slice.ts';

const { Link } = Typography;

interface Props {
    children: ReactNode;
}

export const AppLayout: FC<Props> = ({ children }) => {
    const user = useAppSelector(selectUser);
    const theme = useAppSelector(selectTheme);
    const compact = useAppSelector(selectCompact);
    const dispatch = useAppDispatch();
    const [logout] = useLogoutMutation();
    const [menu, selectedItems] = useMenu(MAIN_MENU);

    const items: MenuProps['items'] = [
        {
            key: 'role',
            label: `${user?.role.name}`,
            icon: <KeyOutlined />,
        },
        {
            key: 'theme',
            label: `Включить ${theme === 'dark' ? 'светлую' : 'темную'} тему`,
            icon: <BgColorsOutlined />,
            onClick: () => dispatch(themeActions.setTheme(theme === 'dark' ? 'light' : 'dark')),
        },
        {
            key: 'compact',
            label: `${compact ? 'Выключить' : 'Включить'} компактный режим`,
            icon: <CompressOutlined />,
            onClick: () => dispatch(themeActions.setCompact(!compact)),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Выйти',
            icon: <LogoutOutlined />,
            onClick: logout,
            danger: true,
        },
    ];

    return (
        <Layout>
            <Layout.Header className={style.header}>
                <Menu
                    items={menu}
                    selectedKeys={selectedItems}
                    mode="horizontal"
                    className={style.menu}
                />

                {user && (
                    <Dropdown menu={{ items }} trigger={['click']} className={style.user}>
                        <Link>
                            {user.full_name} <DownOutlined />
                        </Link>
                    </Dropdown>
                )}
            </Layout.Header>
            <Layout.Content className={style.content}>{children}</Layout.Content>
        </Layout>
    );
};
