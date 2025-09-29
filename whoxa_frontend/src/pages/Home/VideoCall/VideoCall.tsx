import { useNavigate } from "react-router-dom";
import { usePeer } from "../../../hooks/usePeer";
import { useDeviceCheck } from "../../../hooks/useCameraCheck";
import { DeviceErrorPopup } from "../../../components/DeviceErrorPopup";
import CallHeader from "./CallHeader";
import ChatAndParticipents from "./ChatAndParticipents";
import VideoListComponent from "./VideoListComponent";

export default function VideoCall() {
  const navigate = useNavigate();
  const { 
    cameraError, 
    microphoneError, 
    isChecking 
  } = useDeviceCheck();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  usePeer(); // Initialize PeerJS and handle connections

  if (isChecking) {
    return null; // Or a loading spinner
  }

  if (cameraError || microphoneError) {
    return (
      <DeviceErrorPopup 
        cameraError={cameraError}
        microphoneError={microphoneError}
        onBack={handleBack} 
      />
    );
  }


  return (
    <>
      <div className="h-screen overflow-hidden">
        <CallHeader />
        <div className="mx-auto px-4 flex h-full w-full gap-8 py-4 2xl:max-w-[90vw]">
          <VideoListComponent />
          <ChatAndParticipents />
        </div>
      </div>
    </>
  );
}
