export interface Message{
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface MessagesGetAllResponse {
    data: MessagesGet[];
    pagination: Pagination;
}

export interface MessagesGet {
	id: string,
	conversation_id: string,
	content: string,
	is_read: boolean,
	created_at: Date,
	sender_username: string,
	receiver_username: string
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}