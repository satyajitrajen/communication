export interface UserDataRes {
  message: string;
  success: boolean;
  resData: ResData;
}

export interface ResData {
  profile_image: string;
  user_id: number;
  phone_number: string;
  country: string;
  country_full_name: string;
  first_name: string;
  last_name: string;
  device_token: string;
  one_signal_player_id: string;
  user_name: string;
  bio: string;
  dob: string;
  country_code: string;
  email_id: string;
  password: string;
  last_seen: number;
  gender: string;
  Blocked_by_admin: boolean;
  viewed_by_admin: boolean;
  avatar_id: number;
  is_account_deleted: boolean;
}
