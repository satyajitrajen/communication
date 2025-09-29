export interface UserStream {
  peerId: string;
  userName: string;
  userId: number;
  stream: MediaStream;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isLocal?: boolean; // To differentiate the local user from remote users
  currentVideo?: boolean; // To differentiate the local user from remote users
}

export interface StreamContextType {
  userStreams: Record<string, UserStream>;
  addUserStream: (user: UserStream) => void;
  updateUserStream: (peerId: string, updatedData: Partial<UserStream>) => void;
  updateCurrentStream: (peerId: string) => void;
  removeUserStream: (peerId: string) => void;
}
