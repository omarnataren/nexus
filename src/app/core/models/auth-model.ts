export interface AuthResponse {
    access_token: string;
    refresh_token: string;
}

export interface JwtPayload {
    id: string;
    username:  string;
    email: string;
    iat: number;
    exp: number;
}