import { useRef, useState, useEffect } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { SlLocationPin } from "react-icons/sl";
import { updateAddPropertyData } from "../../../app/Slices/AddPropertySlice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateSendMessageData } from "../../../store/Slices/SendMessageSlice";
import NearbyPlaces from "./NearbyPlaces";
import GoogleMapReact from "google-map-react";
import { MdLocationPin } from "react-icons/md";
import ShowMap from "./ShowMap";
import GetUserLocation from "./GetUserLocation";
import ShareLocation from "./ShareLocation";

const libraries = ["places"];

const SearchLocationDropdown = ({}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_Google_MAP_KEY,
    libraries,
  });

  let sendMessageData = useAppSelector((state) => state.SendMessageData);
  const [inputValue, setInputValue] = useState(sendMessageData.message || "");
  const [nearbyPlaces, setNearbyPlaces] = useState<
    google.maps.places.PlaceResult[]
  >([]);

  const dispatch = useAppDispatch();
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (isLoaded && sendMessageData.latitude && sendMessageData.longitude) {
      fetchNearbyPlaces();
    }
  }, [isLoaded, sendMessageData.latitude, sendMessageData.longitude]);

  const fetchNearbyPlaces = () => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps API not loaded");
      return;
    }

    const map = new window.google.maps.Map(document.createElement("div"), {
      center: {
        lat: Number(sendMessageData.latitude),
        lng: Number(sendMessageData.longitude),
      },
      zoom: 15,
    });
    mapRef.current = map;

    const service = new window.google.maps.places.PlacesService(map);

    // const request = {
    //   location: new window.google.maps.LatLng(
    //     Number(sendMessageData.latitude),
    //     Number(sendMessageData.longitude),
    //   ),
    //   radius: 5000, // 5km radius (adjust as needed)
    //   type: ["restaurant", "store", "hospital"], // You can customize this
    // };

    service.nearbySearch(
      {
        location: new window.google.maps.LatLng(
          Number(sendMessageData.latitude),
          Number(sendMessageData.longitude),
        ),
        radius: 5000,
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setNearbyPlaces(results!);

          dispatch(
            updateSendMessageData({
              message: results![0].name,
              message_type: "location",
              // location: place.formatted_address,
            }),
          );
        } else {
          console.error("Nearby search failed with status:", status);
        }
      },
    );
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setInputValue(place.formatted_address);
    // setLat(lat);
    // setLon(lng);
    fetchNearbyPlaces();

    dispatch(
      updateSendMessageData({
        latitude: lat,
        longitude: lng,
        message: place.formatted_address,
        message_type: "location",
        // location: place.formatted_address,
      }),
    );
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return isLoaded ? (
    <div className="relative flex h-full w-full flex-col gap-y-3">
      <div className="absolute top-5 z-10 w-full">
        <Autocomplete
          className="mx-auto w-[90%]"
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={onPlaceChanged}
        >
          <div className="relative w-full">
            <div className="absolute left-2 top-4">
              <SlLocationPin className="text-lg text-darkText" />
            </div>
            <input
              value={inputValue}
              onChange={handleInputChange}
              className="h-12 w-full rounded-lg bg-primary px-4 py-2 pl-8 text-sm text-darkText shadow-xl outline-none transition-all duration-300 focus:border-[#B5843F]"
              type="text"
              placeholder="Add Location"
            />
          </div>
        </Autocomplete>
      </div>
      {/* Show Map */}
      <ShowMap />

      <ShareLocation />

      <NearbyPlaces nearbyPlaces={nearbyPlaces} />
    </div>
  ) : (
    <GetUserLocation />
  );
};

export default SearchLocationDropdown;
