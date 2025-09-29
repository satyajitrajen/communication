export interface ReportedUserDetailsRes {
    success:       string;
    message:       string;
    reportedUsers: ReportedUser[];
    pagination:    Pagination;
}

export interface Pagination {
    total:       number;
    pages:       number;
    currentPage: number;
}

export interface ReportedUser {
    report_id:     number;
    report_text:   string;
    createdAt:     Date;
    updatedAt:     Date;
    reported_by:   number;
    reported_user: number;
    reported:      Reported;
    reportCount:   number;
}

export interface Reported {
    profile_pic:        string;
    user_id:            number;
    user_name:          string;
    first_name:         string;
    last_name:          string;
    email_id:           string;
    dob:                Date;
    mobile_num:         string;
    blocked_from_admin: boolean;
    Country_flag:       string;
}