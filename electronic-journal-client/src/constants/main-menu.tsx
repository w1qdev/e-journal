import { Menu } from '@/types/menu.types.ts';
import {
    BookOutlined,
    BulbOutlined,
    ClusterOutlined,
    OrderedListOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';

export const MAIN_MENU: Menu[] = [
    {
        key: 'manage-schedules',
        link: '/manage-schedules',
        label: 'Управление расписанием',
        icon: <OrderedListOutlined />,
        locations: ['/manage-schedules', '/manage-schedule'],
        roles: ['SCHEDULE_CREATOR', 'ADMIN'],
        color: '#f759ab',
    },
    {
        key: 'student-schedules',
        link: '/student-schedules',
        label: 'Мое расписание',
        icon: <OrderedListOutlined />,
        locations: ['/student-schedules'],
        roles: ['STUDENT'],
        color: '#f759ab',
    },
    {
        key: 'teacher-schedules',
        link: '/teacher-schedules',
        label: 'Мое расписание',
        icon: <OrderedListOutlined />,
        locations: ['/teacher-schedules'],
        roles: ['TEACHER'],
        color: '#f759ab',
    },
    {
        key: 'journal',
        link: '/journal',
        label: 'Журнал',
        icon: <BookOutlined />,
        locations: ['/journal'],
        roles: ['ADMIN', 'TEACHER', 'STUDENT'],
        color: '#ffa940',
    },
    {
        key: 'report',
        link: '/report',
        label: 'Рапортичка',
        icon: <BookOutlined />,
        locations: ['/report'],
        roles: ['ADMIN', 'TEACHER', 'STUDENT'],
        color: '#7f4dff',
    },
    {
        key: 'my-group',
        link: '/my-group',
        label: 'Моя группа',
        icon: <TeamOutlined />,
        locations: ['/my-group'],
        roles: ['STUDENT'],
        color: '#ffa940',
    },
    {
        key: 'users',
        link: '/users',
        label: 'Пользователи',
        icon: <UserOutlined />,
        locations: ['/users'],
        roles: ['ADMIN', 'SCHEDULE_CREATOR'],
        color: '#ff4d4f',
    },
    {
        key: 'subjects',
        link: '/subjects',
        label: 'Предметы',
        icon: <BookOutlined />,
        locations: ['/subjects'],
        roles: ['ADMIN', 'SCHEDULE_CREATOR'],
        color: '#ff7a45',
    },
    {
        key: 'groups',
        link: '/groups',
        label: 'Группы',
        icon: <TeamOutlined />,
        locations: ['/groups'],
        roles: ['ADMIN', 'SCHEDULE_CREATOR'],
        color: '#ffa940',
    },
    {
        key: 'departments',
        link: '/departments',
        label: 'Отделы',
        icon: <ClusterOutlined />,
        locations: ['/departments'],
        roles: ['ADMIN'],
        color: '#ffc53d',
    },
    {
        key: 'professions',
        link: '/professions',
        label: 'Специальности',
        icon: <BulbOutlined />,
        locations: ['/professions'],
        roles: ['ADMIN'],
        color: '#73d13d',
    },
];
