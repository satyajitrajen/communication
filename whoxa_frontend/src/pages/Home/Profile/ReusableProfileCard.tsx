import React, { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { MdCheck } from "react-icons/md";

type ProfileCardProps = {
  icon: JSX.Element;
  right_icon?: JSX.Element;
  value: string;
  onChange?: (newValue: string) => void;
  onClick?: () => void;
  hideRightArrow?: boolean;
  isDisabled?: boolean;
};

const ReusableProfileCard: React.FC<ProfileCardProps> = ({
  icon,
  right_icon,
  value,
  onChange,
  onClick,
  hideRightArrow = false,
  isDisabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [hideRightArrowState, setHideRightArrowState] =
    useState(hideRightArrow);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  console.log(hideRightArrowState, "hideRightArrowState ++++++++++++++++==");

  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-lg border border-borderColor px-5 py-2 2xl:py-3"
      onClick={() => {
        console.log(isEditing, "isEditing");
        console.log(isDisabled, "isDisabled");

        if (!isEditing && !isDisabled) {
          setIsEditing(true);
          setHideRightArrowState(true);
        }
        if (onClick) {
          onClick();
        }
      }}
    >
      <div className="flex items-center gap-3">
        {icon}
        {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            // onBlur={() => setIsEditing(false)}
            className="border-none bg-transparent outline-none"
          />
        ) : (
          <div>{inputValue}</div>
        )}
      </div>
      {!hideRightArrowState && (
        // <>
        //   {isEditing ? (
        //     <MdCheck
        //       onClick={() => {
        //         setIsEditing(false);
        //       }}
        //       className="text-lg"
        //     />
        //   ) : (
        //     <FaAngleRight className="text-lg" />
        //   )}
        // </>
        <>{right_icon ? right_icon : <FaAngleRight className="text-lg" />}</>
      )}
    </div>
  );
};

export default ReusableProfileCard;
