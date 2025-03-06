export interface ChurchType {
    ChurchId: string;
    Name: string;
    Location: string;
    Schedule: string;
    Images: string[];
    Capacity: number;
    Baptism: boolean;
    FirstCommunion: boolean;
    Confirmation: boolean;
    Wedding: boolean;
    Priests: string[];
    Phone: number;
    Email: string;
    Reviews: {
        name: string;
        comment: string;
    }[]
}