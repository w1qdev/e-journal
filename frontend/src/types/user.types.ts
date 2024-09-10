import { Role } from '@/types/role.types.ts';
import { Profession } from '@/types/profession.types.ts';

export interface User {
    id: number;
    username: string;
    email: string;
    last_name: string;
    first_name: string;
    surname?: string;
    full_name: string;
    role: Role;
    group?: {
        id: number;
        course: number;
        name: string;
        profession: Profession;
    };
}
