import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PeerJsSliceType {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  peer_id: string;
  room_id: string;
}

const initialState: PeerJsSliceType = {
  isVideoEnabled: true,
  isAudioEnabled: true,
  isScreenSharing: false,
  peer_id: "",
  room_id: localStorage.getItem("room_id") || "",
};

const peerJsSlice = createSlice({
  name: "PeerJsSlice",
  initialState,
  reducers: {
    updatePeerData(state, action: PayloadAction<Partial<PeerJsSliceType>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updatePeerData } = peerJsSlice.actions;
export default peerJsSlice.reducer;
