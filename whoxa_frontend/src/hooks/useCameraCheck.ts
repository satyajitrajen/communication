import { useState, useEffect } from 'react';

type DeviceCheckResult = {
  hasCamera: boolean;
  hasMicrophone: boolean;
  cameraError: string | null;
  microphoneError: string | null;
  isChecking: boolean;
};

export const useDeviceCheck = (): DeviceCheckResult => {
  const [state, setState] = useState<Omit<DeviceCheckResult, 'isChecking'>>({
    hasCamera: false,
    hasMicrophone: false,
    cameraError: null,
    microphoneError: null,
  });
  
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const audioDevices = devices.filter(device => device.kind === 'audioinput');

        const newState = {
          hasCamera: videoDevices.length > 0,
          hasMicrophone: audioDevices.length > 0,
          cameraError: null as string | null,
          microphoneError: null as string | null,
        };

        // Check camera access
        if (videoDevices.length === 0) {
          newState.cameraError = 'No camera device found. Please connect a camera.';
        } else {
          try {
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoStream.getTracks().forEach(track => track.stop());
          } catch (err) {
            newState.cameraError = 'Camera access was denied. Please allow camera access to continue.';
          }
        }

        // Check microphone access
        if (audioDevices.length === 0) {
          newState.microphoneError = 'No microphone found. Please connect a microphone.';
        } else {
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStream.getTracks().forEach(track => track.stop());
          } catch (err) {
            newState.microphoneError = 'Microphone access was denied. Please allow microphone access to continue.';
          }
        }

        setState(newState);
      } catch (err) {
        console.error('Error checking devices:', err);
        setState({
          hasCamera: false,
          hasMicrophone: false,
          cameraError: 'An error occurred while checking devices.',
          microphoneError: 'An error occurred while checking devices.',
        });
      } finally {
        setIsChecking(false);
      }
    };

    checkDevices();
  }, []);

  return {
    ...state,
    isChecking,
  };
};

export default useDeviceCheck;
