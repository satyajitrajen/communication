import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";
import {
  setQuestion,
  addOption,
  updateOption,
  removeOption,
  resetPoll,
} from "../../../../store/Slices/PollSlice"; // Import Poll Actions
import TextTranslate from "../../../../utils/TextTranslate";
import Button from "../../../../components/Button";
import useApiPost from "../../../../hooks/PostData";
import toast from "react-hot-toast";
import { useTheme } from "../../../../context/ThemeProvider";
import { useTranslateText } from "../../../../hooks/useTranslateText";
import { ClipLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";

export default function CreatePollModal() {
  const dispatch = useAppDispatch();
  const { postData, loading } = useApiPost();
  const translate = useTranslateText();
  const theme = useTheme();

  // Select Poll Data
  const { question, options } = useAppSelector((state) => state.PollData);
  const { conversation_id } = useAppSelector(
    (state) => state.CurrentConversation,
  );

  // Close Modal
  const close = () => {
    dispatch(updateMessageOptions({ show_create_poll_modal: false }));
    dispatch(resetPoll()); // Reset poll state on close
  };

  // Handle question input change
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuestion(e.target.value));
  };

  // Handle option input change
  const handleOptionChange = (index: number, value: string) => {
    dispatch(updateOption({ index, value }));
  };

  // Add new option
  const addPollOption = () => {
    dispatch(addOption());
  };

  // Remove option
  const removePollOption = (index: number) => {
    dispatch(removeOption(index));
  };

  // Submit Poll
  const createPoll = async () => {
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      toast.error("Question and options cannot be empty.");
      return;
    }

    await postData("create-poll", { question, options, conversation_id });
    toast.success("Poll created successfully!");
    close();
  };

  return (
    <Dialog
      open={useAppSelector(
        (state) => state.MessageOptions.show_create_poll_modal,
      )}
      as="div"
      className="relative z-10"
      onClose={() => {}}
    >
      <div className="fixed inset-0 z-10 flex min-h-full items-center justify-center p-4 backdrop-blur-sm">
        <DialogPanel className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-xl bg-modalBg shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out data-[closed]:opacity-0">
          <div className="py-3 shadow-lg">
            <DialogTitle as="h3" className="text-center text-xl font-medium">
              <TextTranslate text="Create Poll" />
            </DialogTitle>
          </div>

          {/* Poll Question Input */}
          <div className="my-8 flex flex-col px-4">
            <div className="space-y-1">
              <div>
                <TextTranslate text="Add Title" />
              </div>
              <input
                value={question}
                onChange={handleQuestionChange}
                className="w-full rounded-xl border border-borderColor bg-transparent px-4 py-2 outline-none"
                type="text"
                placeholder={translate("Enter poll question")}
              />
            </div>

            {/* Poll Options */}
            <div className="mt-3">
              <TextTranslate text="Add Options" />
            </div>
            <div className="mt-3 space-y-3">
              {options.map((option, index) => (
                <div key={index} className="relative flex items-center gap-3">
                  <input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full rounded-xl border border-borderColor bg-transparent px-4 py-2 outline-none"
                    type="text"
                    placeholder={translate(`Option ${index + 1}`)}
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removePollOption(index)}
                      className="absolute right-3 text-[#FCC604]"
                    >
                      <IoClose className="text-xl" />
                    </button>
                  )}
                </div>
              ))}
              {/* Add More Options Button */}

              {options.length < 4 && (
                <button
                  onClick={addPollOption}
                  className="mt-2 px-4 text-sm text-[#FCC604]"
                >
                  + Add More Options
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mx-auto my-5 flex w-[80%] gap-6">
            <button
              onClick={close}
              className="relative h-11 w-full overflow-hidden rounded-lg border border-[#FFEDAB] !bg-transparent px-4 py-2 text-base outline-none lg:px-9 lg:text-lg"
            >
              <TextTranslate text="Cancel" />
            </button>
            {loading ? (
              <button className="primary-gradient relative h-11 w-full overflow-hidden rounded-lg border border-[#FFEDAB] !bg-transparent px-4 py-2 text-base outline-none lg:px-9 lg:text-lg">
                <ClipLoader size={22} />
              </button>
            ) : (
              <Button
                onClickFunc={createPoll}
                className={"!h-11"}
                text={<TextTranslate text="Submit" />}
              />
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
