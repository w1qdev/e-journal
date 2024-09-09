import { createBrowserRouter, Outlet } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage/LoginPage.tsx';
import { AuthNonRequired } from '@/router/AuthNonRequired.tsx';
import { AuthRequired } from '@/router/AuthRequired.tsx';
import { AppLayout } from '@/components/ui/AppLayout/AppLayout.tsx';
import { GroupsPage } from '@/pages/GroupsPage/GroupsPage.tsx';
import { SubjectsPage } from '@/pages/SubjectsPage/SubjectsPage.tsx';
import { RoleRequired } from '@/router/RoleRequired.tsx';
import { UsersPage } from '@/pages/UsersPage/UsersPage.tsx';
import { DepartmentsPage } from '@/pages/DepartmentsPage/DepartmentsPage.tsx';
import { ProfessionsPage } from '@/pages/ProfessionsPage/ProfessionsPage.tsx';
import { SchedulesPage } from '@/pages/SchedulesPage/SchedulesPage.tsx';
import { SchedulePage } from '@/pages/SchedulePage/SchedulePage.tsx';
import { MainPage } from '@/pages/MainPage/MainPage.tsx';
import { MyGroupPage } from '@/pages/MyGroupPage/MyGroupPage.tsx';
import { StudentSchedulesPage } from '@/pages/StudentSchedulesPage/StudentSchedulesPage.tsx';
import { TeacherSchedulesPage } from '@/pages/TeacherSchedulesPage/TeacherSchedulesPage.tsx';
import { JournalPage } from '@/pages/JournalPage/JournalPage.tsx';
import { ReportPage } from '@/pages/ReportPage/ReportPage.tsx';

export const routes = createBrowserRouter([
    // Без авторизации
    {
        element: (
            <AuthNonRequired>
                <Outlet />
            </AuthNonRequired>
        ),
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
        ],
    },

    // С авторизацией
    {
        element: (
            <AuthRequired>
                <AppLayout>
                    <Outlet />
                </AppLayout>
            </AuthRequired>
        ),
        children: [
            {
                path: '/',
                element: <MainPage />,
            },
            {
                path: '/users',
                element: (
                    <RoleRequired roles={['ADMIN']}>
                        <UsersPage />
                    </RoleRequired>
                ),
            },
            {
                path: '/subjects',
                element: (
                    <RoleRequired roles={['ADMIN', 'SCHEDULE_CREATOR']}>
                        <SubjectsPage />
                    </RoleRequired>
                ),
            },
            {
                path: '/groups',
                element: (
                    <RoleRequired roles={['ADMIN', 'SCHEDULE_CREATOR']}>
                        <GroupsPage />
                    </RoleRequired>
                ),
            },
            {
                path: '/departments',
                element: (
                    <RoleRequired roles={['ADMIN']}>
                        <DepartmentsPage />
                    </RoleRequired>
                ),
            },
            {
                path: '/professions',
                element: (
                    <RoleRequired roles={['ADMIN']}>
                        <ProfessionsPage />
                    </RoleRequired>
                ),
            },
            {
                path: '/manage-schedules',
                element: (
                    <RoleRequired roles={['SCHEDULE_CREATOR', 'ADMIN']}>
                        <SchedulesPage />
                    </RoleRequired>
                ),
            },
            {
                path: '/manage-schedule/:scheduleId',
                element: (
                    <RoleRequired roles={['SCHEDULE_CREATOR', 'ADMIN']}>
                        <SchedulePage />
                    </RoleRequired>
                ),
            },
            {
                path: '/my-group',
                element: (
                    <RoleRequired roles={['STUDENT']}>
                        <MyGroupPage />
                    </RoleRequired>
                ),
            },
            {
                path: '/student-schedules',
                element: (
                    <RoleRequired roles={['STUDENT']}>
                        <StudentSchedulesPage />
                    </RoleRequired>
                ),
            },
            {
                path: '/teacher-schedules',
                element: (
                    <RoleRequired roles={['TEACHER']}>
                        <TeacherSchedulesPage />
                    </RoleRequired>
                ),
            },
            {
                path: '/journal',
                element: (
                    <RoleRequired roles={['ADMIN', 'TEACHER', 'STUDENT', 'SCHEDULE_CREATOR']}>
                        <JournalPage />
                    </RoleRequired>
                ),
            },
            {
                path: '/report',
                element: (
                    <RoleRequired roles={['ADMIN', 'TEACHER', 'STUDENT', 'SCHEDULE_CREATOR']}>
                        <ReportPage />
                    </RoleRequired>
                ),
            },
        ],
    },
]);
