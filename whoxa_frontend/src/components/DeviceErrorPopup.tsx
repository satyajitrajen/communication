import { FaVideo, FaMicrophone } from "react-icons/fa";
import Button from "./Button";

interface CameraErrorPopupProps {
  cameraError: string | null;
  microphoneError: string | null;
  onBack: () => void;
}

export const DeviceErrorPopup = ({
  cameraError,
  microphoneError,
  onBack,
}: CameraErrorPopupProps) => {
  const hasErrors = cameraError || microphoneError;

  if (!hasErrors) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary bg-opacity-15 p-4">
      <div className="mx-4 w-full max-w-md rounded-lg bg-secondary p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-yellow-600">
          Device Access Required
        </h2>

        {cameraError && (
          <div className="mb-4 flex items-start gap-3 rounded-lg bg-primary p-3">
            <FaVideo className="mt-0.5 flex-shrink-0 text-xl text-yellow-500" />
            <p className="text-left ">{cameraError}</p>
          </div>
        )}

        {microphoneError && (
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-primary p-3">
            <FaMicrophone className="mt-0.5 flex-shrink-0 text-xl text-yellow-500" />
            <p className="text-left ">{microphoneError}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClickFunc={onBack} text="Go Back" className="" />
        </div>
      </div>
    </div>
  );
};

export default DeviceErrorPopup;
