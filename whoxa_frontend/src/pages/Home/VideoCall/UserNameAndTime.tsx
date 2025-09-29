import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { useStream } from "../../../context/StreamProvider";
import { useEffect, useState } from "react";

export default function UserNameAndTime() {
  const { userStreams } = useStream();
  const currentStream = Object.values(userStreams).find(
    (user) => user.currentVideo,
  );
  const ConnectedUser = useAppSelector((state) => state.ConnectedUser);
  const userData = useAppSelector((state) => state.userData);

  const [elapsedTime, setElapsedTime] = useState(0);

  let startTime = sessionStorage.getItem("callStartTime");

  // useEffect(() => {
  //   // Check if there's a stored start time

  //   if (!startTime) {
  //     // If not found, set the current time as the start time
  //     startTime = Date.now();
  //     sessionStorage.setItem("callStartTime", startTime);
  //   }

  //   // Convert to a number
  //   startTime = Number(startTime);

  //   const interval = setInterval(() => {
  //     const now = Date.now();
  //     setElapsedTime(Math.floor((now - startTime) / 1000)); // Convert ms to seconds
  //   }, 1000);

  //   return () => clearInterval(interval); // Cleanup interval on unmount
  // }, [startTime]);
  useEffect(() => {
    const interval = setInterval(() => {
      const startTime = sessionStorage.getItem("callStartTime");
      const now = Date.now();

      // Only calculate elapsed time if call has actually started
      if (startTime && ConnectedUser.length >= 2) {
        setElapsedTime(Math.floor((now - Number(startTime)) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ConnectedUser]);

  // Convert elapsed seconds to HH:MM:SS format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  let displayName = null;

  if (currentStream && ConnectedUser.length >= 1) {
    if (userData.user_id === currentStream.userId) {
      displayName = "You";
    } else {
      const user = ConnectedUser.find(
        (user) => user.user_id === currentStream.userId,
      );
      if (user) {
        displayName = `${user.first_name} ${user.last_name}`;
      }
    }
  }

  return (
    <div className="absolute top-4 flex w-full justify-between px-5 lg:px-12">
      {displayName && (
        <div className="rounded-lg bg-primary bg-opacity-60 px-4 py-1">
          {displayName}
        </div>
      )}
      {displayName && (
        <div className="rounded-lg bg-primary bg-opacity-60 px-4 py-1">
          {formatTime(elapsedTime)}
        </div>
      )}
    </div>
  );
}
