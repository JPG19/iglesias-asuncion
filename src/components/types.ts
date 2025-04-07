export interface ChurchType {
    ChurchId: string;
    Name: string;
    Location: string;
    Schedule: string;
    Images: string[];
    Baptism: boolean;
    FirstCommunion: boolean;
    Confirmation: boolean;
    Wedding: boolean;
    Phone: number;
    Email: string;
    Reviews: {
        name: string;
        comment: string;
    }[]
}