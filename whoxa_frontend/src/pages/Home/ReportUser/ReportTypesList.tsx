import { ClipLoader } from "react-spinners";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { useTheme } from "../../../context/ThemeProvider";
import useApiPost from "../../../hooks/PostData";
import { useBlockUserList } from "../../../store/api/useBlockUserList";
import { updateForwardedList } from "../../../store/Slices/ForwardMessageSlice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { useState } from "react";
import { useReportTypeList } from "../../../store/api/useReportTypeList";
import toast from "react-hot-toast";
import { MdReport } from "react-icons/md";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";

export default function ReportTypesList() {
  const [selectedReportId, setSelectedReportId] = useState(0);
  // @ts-ignore
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useReportTypeList();
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );

  const dispatch = useAppDispatch();
  const { loading, postData } = useApiPost();

  async function reportUser({ report_id }: { report_id: number }) {
    await postData("report-user", {
      conversation_id: currentConversationData.conversation_id,
      reported_user_id: currentConversationData.is_group
        ? ""
        : currentConversationData.user_id,
      report_id,
    });

    dispatch(
      updateMessageOptions({
        showModal: false,
        selectMessage: false,
        delete_message: false,
        delete_only_from_me: false,
        message_list: [],
        modalName: "",
      }),
    );
    toast.success(
      ` ${
        currentConversationData.is_group
          ? currentConversationData.group_name
          : currentConversationData.user_name
      } is Reported`,
    );
    // Update the block user list
    refetch();
  }

  return (
    <div className="relative my-5 flex h-[60vh] w-full max-w-full flex-col overflow-y-auto overflow-x-hidden">
      {isLoading ? (
        <div className="grid h-full place-content-center">
          <ClipLoader size={23} color={theme == "dark" ? "white" : "black"} />
        </div>
      ) : data?.reportType?.length == 0 ? (
        <div className="grid h-96 place-content-center gap-5">
          <img
            className="mx-auto h-16 w-16"
            src="/LightIcons/no_search_result_found.png"
            alt=""
          />
          <div>No Report Types </div>
        </div>
      ) : (
        data?.reportType?.map((e) => {
          return (
            <>
              <div
                onClick={() => {
                  setSelectedReportId(e.report_id);
                  // reportUser({ report_id: e.report_id });
                }}
                className={`hover:bg-selectedChatdata flex cursor-pointer items-center justify-start px-3 py-4`}
              >
                <div>
                  <div className="text-sm font-medium capitalize text-darkText">
                    {e?.report_title}
                  </div>
                </div>

                {e.report_id == selectedReportId && (
                  <div className="ml-auto mr-4">
                    <MdReport className="text-xl" />
                  </div>
                )}
              </div>
              <hr className="border-t border-borderColor" />
            </>
          );
        })
      )}

      <div className="absolute bottom-5 grid w-full place-content-center">
        <button
          onClick={() => {
            reportUser({ report_id: selectedReportId });
          }}
          className={`h-9 min-w-60 overflow-hidden rounded-full border border-[#FCC605] px-4 text-base font-medium outline-none`}
        >
          {loading ? (
            <ClipLoader size={21} color={theme == "dark" ? "white" : "black"} />
          ) : (
            "Report"
          )}
        </button>
      </div>

      {/* {CreateGroup.user_id.length !== 0 && (
        <div className="absolute bottom-0 flex h-24 w-full items-end bg-gradient-to-t from-primary to-transparent">
          <div
            onClick={() => {
              addMemberToGroup();
              // navigate("/create-group");
            }}
            className="primary-gradient mx-auto my-5 w-[90%] cursor-pointer rounded-lg py-2 text-center"
          >
            {loading ? (
              <ClipLoader
                size={19}
                color={theme == "dark" ? "white" : "black"}
              />
            ) : (
              "Add Member"
            )}
          </div>
        </div>
      )} */}
    </div>
  );
}
