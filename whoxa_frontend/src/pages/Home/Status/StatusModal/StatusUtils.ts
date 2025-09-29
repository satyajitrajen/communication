import { formatRelative } from "date-fns";
import {
  MyStatus,
  StatusListRes,
  StatusMedia,
  UserData,
} from "../../../../types/StatusTypes";

interface UserStories {
  user: {
    name: string;
    profilePic: string;
  };
  stories: {
    url: string;
    type?: "image" | "video";
    header?: { heading: string; subheading: string; profileImage: string };
    duration?: number;
    statusId: string;
    mediaId: string;
    user_id: string;
    status_text: string;
  }[];
}

export function mapStatusesGrouped(res: StatusListRes) {
  if (!res) return [];

  function mapUserStatus(
    name: string,
    profilePic: string,
    data: MyStatus | UserData,
  ): UserStories {
    const stories = data.Statuses.flatMap((status) =>
      status.StatusMedia.map((media: StatusMedia) => ({
        url: media.url,
        type: media.url.endsWith(".mp4")
          ? ("video" as const)
          : ("image" as const),
        header: {
          heading: name,
          subheading: formatRelative(status.updatedAt, new Date()),
          profileImage: profilePic,
        },
        duration: media.url.endsWith(".mp4") ? undefined : 5000,
        statusId: status.status_id,
        mediaId: media.status_media_id,
        user_id: data.user_id,
        status_text: media.status_text,
      })),
    );

    return {
      user: { name, profilePic },
      stories,
    };
  }

  const grouped: UserStories[] = [];

  // ✅ My Status
  if (res.myStatus.Statuses.length > 0) {
    grouped.push(
      mapUserStatus("My Status", res.myStatus.profile_image, res.myStatus),
    );
  }

  // ✅ Others
  [...res.notViewedStatusList, ...res.viewedStatusList].forEach((user) => {
    grouped.push(
      mapUserStatus(
        user.full_name || user.phone_number,
        user.userData.profile_image,
        user.userData,
      ),
    );
  });

  return grouped;
}
