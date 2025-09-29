export interface StatusListRes {
    success:             boolean;
    message:             string;
    viewedStatusList:    ViewedStatusList[];
    notViewedStatusList: ViewedStatusList[];
    myStatus:            MyStatus;
}

export interface MyStatus {
    profile_image: string;
    user_id:       number;
    Statuses:      MyStatusStatus[];
}

export interface MyStatusStatus {
    status_id:   number;
    updatedAt:   Date;
    StatusMedia: StatusMedia[];
    StatusViews: StatusView[];
}

export interface StatusMedia {
    status_text:              string;
    url:                      string;
    thumbnail:                string;
    status_media_id:          number;
    updatedAt:                Date;
    status_media_view_count?: number;
}

export interface ViewedStatusList {
    full_name:    string;
    phone_number: string;
    userData:     UserData;
}

export interface UserData {
    profile_image: string;
    user_id:       number;
    Statuses:      UserDataStatus[];
}

export interface UserDataStatus {
    status_id:   number;
    updatedAt:   Date;
    createdAt:   Date;
    StatusMedia: StatusMedia[];
    StatusViews: StatusView[];
}

export interface StatusView {
    status_count: number;
}
