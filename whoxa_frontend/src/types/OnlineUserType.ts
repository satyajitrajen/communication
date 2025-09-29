export interface OnlineUserRes {
  onlineUserList: string[];
}

export interface LastSeenUserRes {
  lastSeenUserList: LastSeenUserList[];
}

export interface LastSeenUserList {
  user_id: number;
  updatedAt: Date;
}

export interface TypingUserListRes {
  typingUserList: TypingUserList[];
}

export interface TypingUserList {
  user_id: string;
  conversation_id: string;
}
