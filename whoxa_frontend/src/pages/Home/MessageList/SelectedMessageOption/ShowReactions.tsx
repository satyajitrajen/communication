import { MessageList } from "../../../../types/MessageListType";
import { useTheme } from "../../../../context/ThemeProvider";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";
import { useAppDispatch } from "../../../../utils/hooks";

export default function ShowReactions({
  messageData,
}: {
  messageData: MessageList;
}) {
  // Group reactions and count occurrences
  const reactionCounts = messageData.reactionData.reduce(
    (acc, { reaction }) => {
      acc[reaction] = (acc[reaction] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  // @ts-ignore
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  return (
    <div
      onClick={() => {
        dispatch(
          updateMessageOptions({
            show_view_reaction_modal: true,
            message_id: messageData.message_id,
          }),
        );
      }}
      className={`absolute -bottom-5 flex cursor-pointer gap-2 rounded-xl bg-primary px-3 py-[2px] ${
        messageData.myMessage ? "right-1" : "left-1"
      } `}
    >
      {Object.entries(reactionCounts).map(([reaction, count]) => (
        <div key={reaction} className="flex items-center gap-1 text-base">
          <span>{reaction}</span>
          <span
            className={`text-xs font-medium ${theme == "dark" ? "text-white" : "text-black"}`}
          >
            {count > 1 ? count : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
