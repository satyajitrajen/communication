export interface SendMessageData {
  conversation_id?: number;
  message?: string;
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
    | "poll"
    | "";
  phone_number?: string;
  latitude?: string;
  longitude?: string;
  video_time?: string;
  audio_time?: string;
  forward_id?: number;
  reply_id?: number;
  status_id?: number;
  url?: string;
  thumbnail_url?: string;
  fileName?: string;
  showEmojiPicker?: boolean;
  showAttachmentOptions?: boolean;
  other_user_id?: number;
}

// contact List Types ==================================================================================
export interface ContactListRes {
  success: boolean;
  message: string;
  myContactList: MyContactList[];
  pagination: Pagination;
}

export interface MyContactList {
  contact_id: number;
  phone_number: string;
  full_name: string;
  userDetails: UserDetails;
}

export interface UserDetails {
  profile_image: string;
  user_id: number;
  user_name: string;
  email_id: string;
}

export interface Pagination {
  count: number;
  currentPage: number;
  totalPages: number;
}

// contact List Types ==================================================================================
