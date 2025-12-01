export interface User{
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserPost = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;