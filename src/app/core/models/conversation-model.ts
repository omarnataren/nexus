import { User } from "./user-model";

export interface Conversation{
    id: string;
    participant_one_id: string;
    participant_two_id: string;
    last_message_id: string;
    last_message_at: Date;
    created_at: Date;
    updated_at: Date;
    participant_one: User
    participant_two: User
}

export interface ConversationGetAllResponse {
    data: ConversationGet[];
    pagination: Pagination2;
}

export interface ConversationGet {
	id: string,
	last_message_at: Date,
	participant_two_username: string,
	last_message_content: string
}

export interface Pagination2 {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface ConversationPost {
    participant_two_id: string;
}
