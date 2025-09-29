import GoogleMapReact from "google-map-react";
import { useAppSelector } from "../../../utils/hooks";
import { MdLocationPin } from "react-icons/md";

export default function ShowMap() {
  let sendMessageData = useAppSelector((state) => state.SendMessageData);

  return (
    <>
      <div className="h-96 w-full">
        <GoogleMapReact
          bootstrapURLKeys={{
            key: import.meta.env.VITE_Google_MAP_KEY,
          }}
          defaultCenter={{
            lat: Number(sendMessageData.latitude),
            lng: Number(sendMessageData.longitude),
          }}
          defaultZoom={13}
          options={{
            fullscreenControl: false,
          }}
          draggable={false}
          center={{
            lat: Number(sendMessageData.latitude),
            lng: Number(sendMessageData.longitude),
          }}
          //   yesIWantToUseGoogleMapApiInternals
        >
          <img
            className="h-10 w-10 object-contain"
            src="/MessageListIcons/location_icon.png"
            alt=""
            lat={Number(sendMessageData.latitude)} // ✅ This works with GoogleMapReact
            lng={Number(sendMessageData.longitude)} // ✅ This works with GoogleMapReact
          />
        </GoogleMapReact>
      </div>
    </>
  );
}
