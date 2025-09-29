import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { styled } from "@mui/system";
// import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";

const StyledDatePicker = styled(MobileDatePicker)({
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

const OnlyDatePicker = () => {
  // const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const dispatch = useDispatch();

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    if (newDate) {
      const formattedDate = formatDate(newDate);
      setDate(formattedDate);
      // dispatch(
      //   updateSpesificData({
      //     dob: formattedDate,
      //   })
      // );
    }
  };

  const formatDate = (date: dayjs.Dayjs) => {
    return date.format("YYYY-MM-DD");
  };

  return (
    <div className="flex flex-col w-full gap-y-3">
      <span className="text-[#B8B8B8] pl-2 -pb-6">Date</span>
      <div className="w-full">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <StyledDatePicker
              value={selectedDate}
              onChange={handleDateChange}
              label=""
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default OnlyDatePicker;
