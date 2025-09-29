import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers";
import { styled } from "@mui/system";
import dayjs from "dayjs";

interface OnlyTimePickerProps {
  setTime: (time: string) => void;
}

const StyledTimePicker = styled(MobileTimePicker)({
  width: "100%",
  "& input": {
    color: "#fff",
    border: "1px solid #414141",
    borderRadius: "2rem",
    padding: "1rem",
    outline: "none", // Remove focus ring
    backgroundColor: "transparent",
  },
});

const OnlyTimePicker = ({ setTime }: OnlyTimePickerProps) => {
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);

  const handleDateChange = (newTime: dayjs.Dayjs | null) => {
    if (newTime) {
      const formattedTime = formatTime(newTime);
      setTime(formattedTime);
    }
  };

  const formatTime = (time: dayjs.Dayjs) => {
    return time.format("HH:mm");
  };

  return (
    <div className="flex flex-col w-full gap-y-3">
      <span className="text-[#B8B8B8] pl-2 -pb-6">Time</span>
      <div className="w-full">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker"]}>
            <StyledTimePicker
              value={selectedTime}
              onChange={handleDateChange}
              label=""
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default OnlyTimePicker;
