export interface Department {
    id: number;
    name: string;
    president: {
        id: number;
        fullname: string;
    };
}
