import { Subject } from '@/types/subject.types.ts';
import { Journal } from '@/types/journal.types.ts';
import { Report } from '@/types/report.types.ts';

export interface Schedule {
    id: number;
    date: string;
    visible: boolean;
}

export interface ScheduleParam {
    id: number;
    group: {
        id: number;
        name: string;
        course: number;
    };
    schedule: Omit<Schedule, 'visible'>;
    sub_group: string | null;
    subject: Subject;
    first_half: string | null;
    number: number;
    office: number;
    lesson_type: string | null;
    lesson_code: string | null;
    homework: string | null;
    topic: string | null;
    end_date: string | null;
}

export interface ScheduleParamWithJournal extends ScheduleParam {
    journal: Journal[];
}

export interface ScheduleParamWithReport extends ScheduleParam {
    report: Report[];
}

export interface ScheduleLesson {
    name: string;
    number: number;
    office: string;
    time: string;
    group: string;
}

export interface ScheduleWithParams extends Schedule {
    params: ScheduleParam[];
}

export interface GroupSchedule {
    name: string;
    schedule: {
        date: string;
        day: string;
        lessons: ScheduleLesson[];
    }[];
}

export type TeacherSchedule = {
    date: string;
    day: string;
    lessons: ScheduleLesson[];
}[];
