import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { StatusListRes } from "../../types/StatusTypes";

const initialState: StatusListRes = {
  message: "",
  myStatus: {
    Statuses: [],
    profile_image: "",
    user_id: 0,
  },
  notViewedStatusList: [],
  viewedStatusList: [],
  success: true,
};

const StatusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    updateSpesificStatus(state, action: PayloadAction<Partial<StatusListRes>>) {
      return { ...state, ...action.payload };
    },
    updateStatusListRes(state, action: PayloadAction<StatusListRes>) {
      return action.payload;
    },

    // ✅ Update a single story's view count
    updateStatusViewCount(
      state,
      action: PayloadAction<{ statusId: number; statusCount: number }>,
    ) {
      const { statusId, statusCount } = action.payload;

      function updateStatuses(statuses: any[]) {
        statuses.forEach((status) => {
          if (status.status_id === statusId) {
            // update or push the view count
            if (status.StatusViews.length > 0) {
              status.StatusViews[0].status_count = statusCount;
            } else {
              status.StatusViews.push({ status_count: statusCount });
            }
          }
        });
      }

      // update in myStatus
      updateStatuses(state.myStatus.Statuses);

      // update in viewed + notViewed lists
      state.viewedStatusList.forEach((user) => {
        updateStatuses(user.userData.Statuses);
      });
      state.notViewedStatusList.forEach((user) => {
        updateStatuses(user.userData.Statuses);
      });

      // ✅ Move user from notViewed → viewed only if *all* media seen
      const userIndex = state.notViewedStatusList.findIndex((user) =>
        user.userData.Statuses.some((status) => status.status_id === statusId),
      );

      if (userIndex !== -1) {
        const user = state.notViewedStatusList[userIndex];

        // Check if all media across all statuses are fully seen
        const allSeen = user.userData.Statuses.every((status) => {
          const viewedCount =
            status.StatusViews.length > 0
              ? status.StatusViews[0].status_count
              : 0;
          return viewedCount >= status.StatusMedia.length; // ✅ compare with media count
        });

        if (allSeen) {
          const [movedUser] = state.notViewedStatusList.splice(userIndex, 1);
          state.viewedStatusList.push(movedUser);
        }
      }
    },
  },
});

export default StatusSlice.reducer;
export const {
  updateSpesificStatus,
  updateStatusListRes,
  updateStatusViewCount,
} = StatusSlice.actions;
