export interface OtpRes {
  message: string;
  success: boolean;
  token: string;
  resData: ResData;
}

export interface ResData {
  profile_image: string;
  user_id: number;
  phone_number: string;
  country: string;
  first_name: string;
  last_name: string;
  device_token: string;
  one_signal_player_id: string;
  user_name: string;
  bio: string;
  dob: string;
  country_code: string;
  password: string;
  last_seen: number;
  otp: number;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlockUserRes {
  is_block: boolean;
  success: boolean;
  message: string;
}

// {{base_url}}create-group response ==================================================================================
export interface CreateGroupRes {
  success: boolean;
  message: string;
  conversation_id: number;
  conversationDetails: ConversationDetails;
}

export interface ConversationDetails {
  group_profile_image: string;
  group_name: string;
}
// {{base_url}}create-group response ==================================================================================

// Update Group Response ==================================================================================
export interface UpdateGroupRes {
  success: boolean;
  message: string;
  conversation_id: string;
  conversationDetails: ConversationDetails;
}

export interface ConversationDetails {
  group_profile_image: string;
  group_name: string;
}

// Avtar list response ==================================================================================
export interface AvatarListRes {
  success: boolean;
  message: string;
  avatars: Avatar[];
  pagination: Pagination;
}

export interface Avatar {
  avtar_Media: string;
  avatar_id: number;
  avatar_name: string;
  avatar_gender: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pagination {
  count: number;
  currentPage: number;
  totalPages: number;
}

// Group Settings ==================================================================================
export interface GroupSettingsRes {
  success: boolean;
  message: string;
  settings: Setting[];
}

export interface Setting {
  setting_id: number;
  max_members: number;
  createdAt: Date;
  updatedAt: Date;
}

// Report-type-list ==================================================================================
export interface ReportTypeRes {
  success: boolean;
  message: string;
  reportType: ReportType[];
}

export interface ReportType {
  report_id: number;
  report_title: string;
  report_details: string;
  report_for: string;
  createdAt: Date;
  updatedAt: Date;
}

// WebsiteSettingsRes ==================================================================================
export interface WebsiteSettingsRes {
  success: boolean;
  message: string;
  Data: string;
  settings: Setting[];
}

export interface Setting {
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_FROM_NUMBER: string;
  email_service: string;
  smtp_host: string;
  mail_user: string;
  mail_password: string;
  website_logo: string;
  website_fav_icon: string;
  setting_id: number;
  website_name: string;
  website_email: string;
  website_text: string;
  website_color_primary: string;
  website_color_secondary: string;
  website_link: string;
  ios_link: string;
  android_link: string;
  tell_a_friend_link: string;
  baseUrl: string;
  JWT_SECRET_KEY: string;
  createdAt: Date;
  updatedAt: Date;
  email_auth: boolean;
  phone_auth: boolean;
}

// Privacy Policy ==================================================================================
export interface PrivacyPolicyRes {
  success: boolean;
  message: string;
  privacy_policy: PrivacyPolicy[];
}

export interface PrivacyPolicy {
  id: number;
  Link: string;
  createdAt: Date;
  updatedAt: Date;
}
// Terms and Condition ==================================================================================
export interface TermsAndConditionRes {
  success: boolean;
  message: string;
  TandCs: TandC[];
}

export interface TandC {
  id: number;
  Link: string;
  createdAt: Date;
  updatedAt: Date;
}

// Language Listres ==================================================================================

export interface LanguageListRes {
  success: boolean;
  message: string;
  languages: Language[];
}

export interface Language {
  language: string;
  status: boolean;
  default_status: boolean;
  status_id: number;
  country: string;
  language_alignment: string;
}

// Pin Message list res ==================================================================================
export interface PinMessageListRes {
  success: boolean;
  message: string;
  PinMessageList: PinMessageList[];
}

export interface PinMessageList {
  pin_message_id: number;
  duration: string;
  expires_at: Date | null;
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
    | "";
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

// PublicGroup res ==================================================================================
export interface AllPublicGroupRes {
  success: boolean;
  message: string;
  allPublicGroup: AllPublicGroup[];
  pagination: Pagination;
}

export interface AllPublicGroup {
  group_profile_image: string;
  conversation_id: number;
  is_group: boolean;
  group_name: string;
  last_message: string;
  last_message_id: number;
  last_message_type: string;
  blocked_by_admin: boolean;
  created_by_admin: boolean;
  public_group: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pagination {
  count: number;
  currentPage: number;
  totalPages: number;
}

// ConnectedUserList ==================================================================================
export interface ConnectedUserListRes {
  connectedUsers: ConnectedUser[];
}

export interface ConnectedUser {
  profile_image: string;
  user_id: number;
  user_name: string;
  first_name: string;
  last_name: string;
}

// CallData ==================================================================================
export interface CallData {
  senderId: number;
  receiver_token: string;
  one_signal_player_id: string;
  call_type: string;
  missed_call: boolean;
  sender_phone_number: string;
  senderName: string;
  sender_profile_image: string;
  is_group: boolean;
  room_id: string;
  sender_first_name: string;
  receiver_profile_image: string;
  receiver_phone_number: string;
  receiverId: number;
  message_id: number;
  call_id: number;
  conversation_id: string;
}

// CallUserRes ==================================================================================
export interface CallUserRes {
  room_id: string;
  call_id: number;
  message_id: number;
  success: boolean;
}

//  CallListRes ==================================================================================
export interface CallListRes {
  callList: CallList[];
  success: boolean;
}

export interface CallList {
  call_id: number;
  message_id: number;
  missed_call: string;
  call_accept: string;
  call_decline: string;
  room_id: string;
  call_time: string;
  call_type: string;
  createdAt: Date;
  updatedAt: Date;
  conversation_id: number;
  user_id: number;
  Conversation: Conversation;
  User: User;
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
  user_name: string;
  first_name: string;
  last_name: string;
}

// StatusViewesRes ==================================================================================
export interface StatusViewesRes {
  success:         boolean;
  message:         string;
  statusViewsList: StatusViewsList[];
}

export interface StatusViewsList {
  createdAt:    Date;
  status_count: number;
  User:         User;
}

export interface User {
  profile_image: string;
  user_id:       number;
  first_name:    string;
  last_name:     string;
  phone_number:  string;
  user_name:     string;
}
