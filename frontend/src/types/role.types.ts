export type RoleSlugs = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'SCHEDULE_CREATOR';

export interface Role {
    id: number;
    name: string;
    slug: RoleSlugs;
}
