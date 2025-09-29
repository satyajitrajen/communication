export interface BlockUserListRes {
  success:       boolean;
  message:       string;
  blockUserList: BlockUserList[];
}

export interface BlockUserList {
  block_id:        number;
  createdAt:       Date;
  updatedAt:       Date;
  user_id:         number;
  conversation_id: number;
  Conversation:    Conversation;
}

export interface Conversation {
  group_profile_image: string;
  conversation_id:     number;
  is_group:            boolean;
  group_name:          string;
  last_message:        string;
  last_message_type:   string;
  createdAt:           Date;
  updatedAt:           Date;
  BlockedUserDetails:  BlockedUserDetail[];
}

export interface BlockedUserDetail {
  profile_image: string;
  user_id:       number;
  first_name:    string;
  last_name:     string;
  user_name:     string;
  phone_number:  string;
}
