import React, { createContext, useState, useContext } from "react";
import { StreamContextType, UserStream } from "../types/StreamTypes";

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export const StreamProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userStreams, setUserStreams] = useState<Record<string, UserStream>>(
    {},
  );

  const addUserStream = (user: UserStream) => {
    setUserStreams((prev) => ({ ...prev, [user.peerId]: user }));
  };

  const updateUserStream = (
    peerId: string,
    updatedData: Partial<UserStream>,
  ) => {
    setUserStreams((prev) => ({
      ...prev,
      [peerId]: { ...prev[peerId], ...updatedData },
    }));
  };

  const updateCurrentStream = (peerId: string) => {
    setUserStreams((prev) => {
      const updatedStreams = Object.fromEntries(
        Object.entries(prev).map(([id, streamData]) => [
          id,
          { ...streamData, currentVideo: id === peerId },
        ]),
      );

      return updatedStreams;
    });
  };

  const removeUserStream = (peerId: string) => {
    setUserStreams((prev) => {
      const newStreams = { ...prev };
      delete newStreams[peerId];
      return newStreams;
    });
  };

  return (
    <StreamContext.Provider
      value={{
        userStreams,
        addUserStream,
        updateUserStream,
        removeUserStream,
        updateCurrentStream,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = (): StreamContextType => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStream must be used within a StreamProvider");
  }
  return context;
};
