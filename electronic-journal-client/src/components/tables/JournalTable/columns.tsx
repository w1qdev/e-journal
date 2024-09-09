import { User } from '@/types/user.types.ts';
import { ScheduleParamWithJournal } from '@/types/schedule.types.ts';
import { ColumnsType } from 'antd/es/table';
import { formatDate } from '@/utils/format-date.ts';
import { Button, Descriptions, Empty, Popover } from 'antd';
import dayjs from 'dayjs';

export interface JournalTableData {
    key: number;
    student: User;

    [key: number]: string | null;
}

type ColumnsTypes<Item> = (ColumnsType<Item>[number] & { dataIndex: string })[];

const getPopoverContent = (param: ScheduleParamWithJournal) => {
    return param.lesson_code || param.topic ? (
        <Descriptions title="Информация о занятии" column={1} size={'small'} bordered>
            {param.lesson_type === 'LAB_WORK' || null ? (
                <Descriptions.Item label="Номер работы">{param.lesson_code} </Descriptions.Item>
            ) : (
                <Descriptions.Item label="Шифр занятия">{param.lesson_code} </Descriptions.Item>
            )}
            <Descriptions.Item label="Тема занятия">{param.topic}</Descriptions.Item>
            <Descriptions.Item label="Задание на дом">{param.homework}</Descriptions.Item>
            <Descriptions.Item label="Срок сдачи задания">
                {dayjs(param.end_date).isValid() ? dayjs(param.end_date).format('DD.MM.YYYY') : ''}
            </Descriptions.Item>
        </Descriptions>
    ) : (
        <Empty description="Нет информации о занятии" />
    );
};

const getPopoverAttestation = (onRemove?: () => void) => {
    return (
        <Button type="primary" danger onClick={onRemove}>
            Удалить
        </Button>
    );
};

const getCutLessonType = (lessonType: string | null) => {
    switch (lessonType) {
        case 'LAB_WORK':
            return 'Лаб. раб.';
        case 'SELF_WORK':
            return 'Сам. раб.';
        case 'LECTURE':
            return 'Лекция';
        case 'PRACTICE':
            return 'Практ.';
        default:
            return '';
    }
};

export const getJournalColumns = (
    currentUser: User,
    params: ScheduleParamWithJournal[],
    onParamClick: (param: ScheduleParamWithJournal) => void,
    onParamRemove: (param: ScheduleParamWithJournal) => void,
) => {
    const isAdmin = currentUser.role.slug === 'ADMIN';

    return [
        {
            key: 'student',
            render: (_, record) => record.student.full_name,
            title: 'Студент',
            fixed: window.innerWidth > 1000 ? 'left' : undefined,
            width: 300,
        },
        ...params.map((param) => {
            const isEditParam =
                (!param.subject.teacher && currentUser.role.slug === 'TEACHER') ||
                currentUser.id === param.subject.teacher?.id ||
                isAdmin;

            return {
                key: param.id,
                dataIndex: param.id,
                title:
                    param.number === 0 ? (
                        isEditParam ? (
                            <Popover
                                content={() => getPopoverAttestation(() => onParamRemove(param))}
                                placement="bottom"
                            >
                                <div style={isEditParam ? { cursor: 'pointer' } : undefined}>
                                    {param.lesson_code}
                                </div>
                            </Popover>
                        ) : (
                            <div style={isEditParam ? { cursor: 'pointer' } : undefined}>
                                {param.lesson_code}
                            </div>
                        )
                    ) : (
                        <Popover content={() => getPopoverContent(param)} placement="bottom">
                            <div
                                onClick={isEditParam ? () => onParamClick(param) : undefined}
                                style={{ cursor: 'pointer' }}
                            >
                                {formatDate(param.schedule.date, 'DD.MM.YY')}{' '}
                                {param.lesson_type && <>({getCutLessonType(param.lesson_type)})</>}
                            </div>
                        </Popover>
                    ),
                width: 80,
            };
        }),
    ] as ColumnsTypes<JournalTableData>;
};
