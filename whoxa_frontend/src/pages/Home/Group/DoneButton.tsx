import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../utils/hooks";
import useApiPost from "../../../hooks/PostData";
import { useFile } from "../../../context/FileProvider";
import { CreateGroupRes } from "../../../types/ResType";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useTheme } from "../../../context/ThemeProvider";

export default function DoneButton() {
  const CreateGroup = useAppSelector((state) => state.CreateGroup);
  let navigate = useNavigate();
  const { loading, postData } = useApiPost();
  const { selectedFile, setSelectedFile } = useFile();
  const theme = useTheme();

  if (CreateGroup.user_id.length === 0) return null;

  async function createGroupApi() {
    // if (selectedFile == null) {
    //   return toast.error("Please Select Group Profile!", {
    //     position: "bottom-left",
    //   });
    // }
    if (
      CreateGroup.group_name == "Group Name" ||
      CreateGroup.group_name == ""
    ) {
      return toast.error("Please Enter Group Name!", {
        position: "bottom-left",
      });
    }

    let createGroupFormData = new FormData();

    createGroupFormData.append("group_name", CreateGroup.group_name);
    createGroupFormData.append(
      "public_group",
      String(CreateGroup.public_group),
    );
    createGroupFormData.append("files", selectedFile!);
    // Make the API call with the constructed FormData
    let sendMessageRes: CreateGroupRes = await postData(
      "create-group",
      createGroupFormData,
      "multipart/form-data",
    );
    if (sendMessageRes.conversation_id) {
      let multiple_user_id = CreateGroup.user_id.join(",");
      let addMemberResponse = await postData("add-member-to-group", {
        conversation_id: sendMessageRes.conversation_id,
        multiple_user_id: multiple_user_id,
      });
      toast.success("Group Created Successfully");
      navigate("/chat");
    }
  }

  return (
    <div className="absolute bottom-10 flex h-24 w-full items-end bg-gradient-to-t from-primary to-transparent lg:bottom-0">
      <div
        onClick={() => {
          createGroupApi();
        }}
        className="primary-gradient mx-auto my-5 w-[90%] cursor-pointer rounded-lg py-2 text-center"
      >
        {loading ? (
          <ClipLoader size={17} color={theme == "dark" ? "white" : "black"} />
        ) : (
          "Done"
        )}
      </div>
    </div>
  );
}
