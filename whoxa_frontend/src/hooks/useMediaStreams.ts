// @ts-nocheck
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useMediaStreams = () => {
  const [localStream, setLocalStream] = useState(new MediaStream());
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const { videoEnabled, micEnabled, screenSharing } = useSelector(
    (state) => state.MediaSoupSlice,
  );

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        if (!cameraStream) {
          const newCameraStream = await navigator.mediaDevices.getUserMedia({
            video: videoEnabled,
            audio: micEnabled,
          });
          setCameraStream(newCameraStream);
        } else {
          // Enable or disable video/audio tracks dynamically without re-requesting
          cameraStream
            .getVideoTracks()
            .forEach((track) => (track.enabled = videoEnabled));
          cameraStream
            .getAudioTracks()
            .forEach((track) => (track.enabled = micEnabled));
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    getCameraStream();
  }, [videoEnabled, micEnabled]);

  useEffect(() => {
    const handleScreenSharing = async () => {
      if (screenSharing && !screenStream) {
        try {
          const newScreenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });
          setScreenStream(newScreenStream);
        } catch (error) {
          console.error("Error accessing screen share:", error);
        }
      } else if (!screenSharing && screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
    };

    handleScreenSharing();
  }, [screenSharing]);

  useEffect(() => {
    // Combine camera and screen streams
    const combinedStream = new MediaStream();
    if (cameraStream) {
      cameraStream
        .getTracks()
        .forEach((track) => combinedStream.addTrack(track));
    }
    if (screenStream) {
      screenStream
        .getVideoTracks()
        .forEach((track) => combinedStream.addTrack(track));
    }
    setLocalStream(combinedStream);
  }, [cameraStream, screenStream]);

  return { localStream };
};

export default useMediaStreams;
