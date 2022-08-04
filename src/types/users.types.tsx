export interface User{
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

export interface SingleUserResponse{
    data: User,
    support: {
        url: string;
        text: string;
    }
}

export interface UsersResponse{
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data:User[]
}