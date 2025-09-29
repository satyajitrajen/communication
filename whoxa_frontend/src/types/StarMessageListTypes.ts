export interface StarMessageListRes {
  success: boolean;
  message: string;
  StarMessageList: StarMessageList[];
}

export interface StarMessageList {
  star_message_id: number;
  createdAt: Date;
  updatedAt: Date;
  message_id: number;
  conversation_id: number;
  user_id: number;
  Chat: Chat;
  other_user_id: number;
  otherUserDetails: User[];
}

export interface Chat {
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
  Conversation: Conversation;
}

export interface Conversation {
  group_profile_image: string;
  conversation_id: number;
  is_group: boolean;
  group_name: string;
}

export interface User {
  profile_image: string;
  user_id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  user_name: string;
}
