import { User } from "@models/user-model";
import { Pagination } from "@models/common-models";
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
    pagination: Pagination;
}

export interface ConversationGet {
	id: string,
	last_message_at: Date,
	participant_two_username: string,
	last_message_content: string
}



export interface ConversationPost {
    participant_two_id: string;
}
