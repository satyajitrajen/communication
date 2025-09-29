export interface ConversationInfoRes {
  status: boolean;
  conversationDetails: ConversationDetails;
  mediaData: MediaDatum[];
  documentData: Datum[];
  linkData: Datum[];
}

export interface ConversationDetails {
  group_profile_image: string;
  is_group: boolean;
  blocked_by_admin: boolean;
  group_name: string;
  ConversationsUsers: ConversationsUser[];
}

export interface ConversationsUser {
  is_admin: boolean;
  conversations_user_id: number;
  createdAt: Date;
  User: User;
}

export interface User {
  profile_image: string;
  user_id: number;
  phone_number: string;
  country_code: string;
  country: string;
  user_name: string;
  first_name: string;
  last_name: string;
  bio: string;
}

export interface Datum {
  url?: string;
  message_id: number;
  message_type?:
    | "image"
    | "video"
    | "text"
    | "location"
    | "document"
    | "audio"
    | "contact"
    | "status"
    | "gif"
    | "date"
    | "video_call"
    | "audio_call"
    | "";
  createdAt: Date;
  message?: string;
  senderId: number;
}

export interface MediaDatum {
  url: string;
  thumbnail: string;
  message_id: number;
  video_time: string;
  message_type?:
    | "image"
    | "video"
    | "text"
    | "location"
    | "document"
    | "audio"
    | "contact"
    | "status"
    | "gif"
    | "date"
    | "video_call"
    | "audio_call"
    | "";
  createdAt: Date;
  senderId: number;
}
