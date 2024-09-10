export interface Journal {
    id: number;
    student: {
        id: number;
        fullname: string;
    };
    rate: string;
    rate_date: string;
}
