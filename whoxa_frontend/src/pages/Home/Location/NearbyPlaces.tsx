import React from "react";
import { useDispatch } from "react-redux";
import { updateSendMessageData } from "../../../store/Slices/SendMessageSlice";
import TextTranslate from "../../../utils/TextTranslate";

export default function NearbyPlaces({
  nearbyPlaces,
}: {
  nearbyPlaces: google.maps.places.PlaceResult[];
}) {
  const dispatch = useDispatch();

  const handleSelectPlace = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    dispatch(
      updateSendMessageData({
        latitude: String(lat),
        longitude: String(lng),
        message: place.formatted_address || place.name,
        message_type: "location",
      }),
    );
  };

  return (
    <>
      {nearbyPlaces.length > 0 ? (
        <div>
          <h3 className="my-3 px-5 text-sm font-medium">Nearby Places</h3>
          <div className="flex h-96 flex-col gap-y-3 overflow-scroll pb-24">
            {nearbyPlaces.map((place) => (
              <React.Fragment key={place.place_id}>
                <div
                  className="flex cursor-pointer gap-2 px-5"
                  onClick={() => handleSelectPlace(place)}
                >
                  <img className="h-5 w-5" src={place?.icon} alt="" />
                  <span className="text-sm">
                    {place.name}
                    {place.vicinity !== place.name && `, ${place.vicinity}`}
                  </span>
                </div>
                <hr className="border-t border-borderColor" />
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid h-96 place-content-center gap-5">
          <img
            className="mx-auto h-16 w-16"
            src="/LightIcons/no_search_result_found.png"
            alt=""
          />
          <div>
            <TextTranslate text="No nearby places found" />
          </div>
        </div>
      )}
    </>
  );
}
