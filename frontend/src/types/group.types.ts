import { Subject } from '@/types/subject.types.ts';
import { Profession } from '@/types/profession.types.ts';

export interface Group {
    id: number;
    name: string;
    course: number;
    profession: Profession;
    subjects: Subject[];
    tutor: {
        id: number;
        fullname: string;
    } | null;
}
