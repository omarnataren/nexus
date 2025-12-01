export interface Session{
    id: string;
    userId: number;
    refresh_token: string;
    device_info: string;
    ip_address: string;
    user_agent: string;
    expires_at: Date;
    created_at: Date;
    last_used_at: Date;
}