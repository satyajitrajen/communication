export interface ChatListRes {
  chatList: ChatList[];
}

export interface ChatList {
  conversation_id: number;
  is_group: boolean;
  group_name: string;
  group_profile_image: string;
  last_message: string;
  last_message_type: string;
  user_id: number;
  user_name: string;
  phone_number: string;
  email_id: string;
  profile_image: string;
  is_block: boolean;
  createdAt: string;
  updatedAt: string;
  unread_count: number;
  public_group: boolean;
}

export interface ArchiveListRes {
  archiveList: ArchiveList[];
}

export interface ArchiveList {
  conversation_id: number;
  is_group: boolean;
  group_name: string;
  group_profile_image: string;
  last_message: string;
  last_message_type: string;
  user_id: number;
  user_name: string;
  phone_number: string;
  email_id: string;
  profile_image: string;
  is_block: boolean;
  createdAt: Date;
  updatedAt: Date;
  unread_count: string;
  public_group: boolean;
}

export interface CreateGroup {
  user_id: number[];
  existing_member_user_id: number[];
  createNewGroup: boolean;
  group_name: string;
  group_name_limit: number;
  show_add_member_modal?: boolean;
  public_group?: boolean;
}
