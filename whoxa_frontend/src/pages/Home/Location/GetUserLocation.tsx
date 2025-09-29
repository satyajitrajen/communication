import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../utils/hooks";
import { updateSendMessageData } from "../../../store/Slices/SendMessageSlice";

export default function GetUserLocation() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          dispatch(
            updateSendMessageData({
              latitude: lat,
              longitude: lng,
              message_type: "location",
            }),
          );
        },
        (error) => {
          setError("Location access denied. Enable GPS and refresh.");
        },
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, [dispatch]);

  return <>{error && <p className="text-red-500">{error}</p>}</>;
}
