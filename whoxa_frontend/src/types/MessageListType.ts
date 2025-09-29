export interface MessageListRes {
  conversation_id(conversation_id: any, arg1: string): unknown;
  MessageList: MessageList[];
  totalPages: number;
  currentPage: string;
}

export interface MessageList {
  url: string;
  thumbnail: string;
  message_id: number;
  message: string;
  message_type?:
    | "image"
    | "video"
    | "text"
    | "link"
    | "location"
    | "document"
    | "audio"
    | "contact"
    | "status"
    | "gif"
    | "date"
    | "video_call"
    | "audio_call"
    | "member_added"
    | "member_removed"
    | "delete_from_everyone"
    | "poll"
    | "";
  message_read: number;
  video_time: string;
  audio_time: string;
  latitude: string;
  longitude: string;
  shared_contact_name: string;
  shared_contact_number: string;
  forward_id: number;
  reply_id: number;
  status_id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  conversation_id: number;
  is_star_message: boolean;
  delete_from_everyone: boolean;
  delete_for_me: string;
  myMessage: boolean;
  senderData: SenderData;
  reactionData: ReactionData[];
  who_seen_the_message?: string;
  shared_contact_profile_image?: string;
  pollData: PollData[];
  statusData: StatusData[];
}

export interface PollData {
  poll_option_id: number;
  optionText: string;
  message_id: number;
  PollVotes: PollVote[];
}

export interface PollVote {
  user_id: number;
  updatedAt: Date;
}

export interface SenderData {
  profile_image: string;
  user_id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}
export interface ReactionData {
  reaction_id: number;
  reaction: string;
  message_id: number;
  user_id: number;
}
export interface StatusData {
  status_id: number;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  user_id: number;
  StatusMedia: StatusMedia[];
}

export interface StatusMedia {
  status_text: string;
  url: string;
  status_media_id: number;
  updatedAt: Date;
}

// Search Message Res ==================================================================================
export interface SearchResultRes {
  success: boolean;
  message: string;
  searchResults: SearchResult[];
}

export interface SearchResult {
  url: string;
  thumbnail: string;
  message_id: number;
  message: string;
  message_type: string;
  who_seen_the_message: string;
  delete_from_everyone: boolean;
  delete_for_me: string;
  message_read: number;
  video_time: string;
  audio_time: string;
  latitude: string;
  longitude: string;
  shared_contact_name: string;
  shared_contact_profile_image: string;
  shared_contact_number: string;
  forward_id: number;
  reply_id: number;
  status_id: number;
  createdAt: Date;
  updatedAt: Date;
  senderId: number;
  conversation_id: number;
  User: User;
}

export interface User {
  profile_image: string;
  user_id: number;
  phone_number: string;
  user_name: string;
  first_name: string;
  last_name: string;
}
