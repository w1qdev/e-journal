export interface Subject {
    id: number;
    name: string;
    slug: string;
    code: string;
    teacher?: {
        id: number;
        fullname: string;
    };
}
