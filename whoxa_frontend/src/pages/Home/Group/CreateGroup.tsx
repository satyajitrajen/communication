// import { useTheme } from "../../../context/ThemeProvider";
// // import ConversationList from "./ConversationList";
// import { FaChevronLeft } from "react-icons/fa6";
// import { useNavigate } from "react-router-dom";
// import ReusableProfileCard from "../Profile/ReusableProfileCard";
// import { PiUsersThree } from "react-icons/pi";
// import { FiPlus } from "react-icons/fi";
// import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
// import { useContactList } from "../../../store/api/useContactList";
// import {
//   addOrRemoveUserId,
//   updateCreateGroupData,
// } from "../../../store/Slices/CreateGroupSlice";
// import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
// import { useFile } from "../../../context/FileProvider";
// import { MdCancel } from "react-icons/md";
// import { useEffect, useState } from "react";
// // import ReusableProfileCard from "./ReusableProfileCard"; // Adjust the import path accordingly

// export default function CreateGroup() {
//   // @ts-ignore
//   const { theme } = useTheme();
//   let navigate = useNavigate();
//   let { data: contactListUser } = useContactList();
//   let CreateGroup = useAppSelector((state) => state.CreateGroup);
//   let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
//   const dispatch = useAppDispatch();
//   const { selectedFile, setSelectedFile } = useFile();
//   const [selectedFileUrl, setSelectedFileUrl] = useState("");

//   const handleValueChange = (newValue: string) => {
//     console.log(newValue, "newValue");

//     dispatch(updateCreateGroupData({ group_name: newValue }));
//   };

//   const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFile(null);

//     const files = event.target.files![0];
//     if (!files) return; // Handle case where no files are selected

//     setSelectedFile(files);
//   };

//   useEffect(() => {
//     if (selectedFile) {
//       setSelectedFileUrl(URL.createObjectURL(selectedFile));
//     }
//   }, [selectedFile]);

//   return (
//     <>
//       <div className="relative flex h-screen min-w-80 flex-col bg-secondary shadow-inner 2xl:min-w-96">
//         <div
//           style={{
//             backgroundSize: "100%",
//           }}
//           className="h-96 w-full space-y-5 bg-[url('/Home/profile_bg.png')] bg-no-repeat px-4 xl:space-y-7"
//         >
//           <div className="flex items-center gap-3 pt-16 font-semibold text-black 2xl:pt-16">
//             <FaChevronLeft
//               className="cursor-pointer"
//               onClick={() => {
//                 navigate(-1);
//               }}
//             />
//             <span className="">Add Group Icon</span>
//           </div>

//           {/* Group Profile Image */}
//           <div className="grid w-full place-content-center">
//             <label
//               htmlFor="groupPhotoInput"
//               className="relative mx-auto w-fit cursor-pointer"
//             >
//               {selectedFile == null ? (
//                 <img
//                   src={"/Home/empty_group_profile.png"}
//                   className={`h-20 w-20 rounded-full bg-secondary object-cover p-2 2xl:h-32 2xl:w-32`}
//                   alt=""
//                 />
//               ) : (
//                 <img
//                   src={selectedFileUrl}
//                   className={`h-20 w-20 rounded-full bg-secondary object-cover p-2 2xl:h-32 2xl:w-32`}
//                   alt=""
//                 />
//               )}
//               <input
//                 onChange={onFileChange}
//                 accept="image/*"
//                 className="hidden"
//                 type="file"
//                 id="groupPhotoInput"
//               />
//               {selectedFile == null && (
//                 <div className="absolute top-0 flex h-20 w-20 flex-col items-center justify-center text-center text-sm 2xl:h-32 2xl:w-32">
//                   <div className="mb-2 grid h-8 w-8 place-content-center rounded-full bg-[#9E9E9E]">
//                     <FiPlus className="h-7 w-7" />
//                   </div>
//                   <div>Add Group</div>
//                   <div>Icon</div>
//                 </div>
//               )}
//             </label>
//           </div>

//           {/* Group Name */}
//           <div className="flex flex-col gap-4">
//             <ReusableProfileCard
//               icon={<PiUsersThree className="text-2xl" />}
//               value="Group Name"
//               // @ts-ignore
//               onChange={handleValueChange}
//             />
//           </div>
//         </div>
//         <div className="mt-6 px-4">
//           Members : {CreateGroup.user_id.length} Out Of 230
//         </div>
//         <div className="relative flex h-[80vh] w-full max-w-full flex-col overflow-y-auto overflow-x-hidden">
//           {contactListUser?.myContactList
//             .filter((contact) =>
//               CreateGroup.user_id.includes(contact.userDetails.user_id),
//             )
//             .map((e) => {
//               return (
//                 <>
//                   <div className={`flex cursor-pointer items-center px-3 py-4`}>
//                     <div className="relative mr-3 h-14 w-14 2xl:h-12 2xl:w-12">
//                       <LoadingSkeletonImageDynamic
//                         radius=""
//                         className="h-10 w-10 rounded-full object-cover 2xl:h-12 2xl:w-12"
//                         image_height="100%"
//                         image_url={e?.userDetails?.profile_image}
//                         image_width=""
//                       />
//                       {OnlineUserList.onlineUserList.includes(
//                         e.userDetails.user_id.toString(),
//                       ) && (
//                         <img
//                           className="absolute bottom-0 right-0 z-30 h-4 w-4"
//                           src="/Home/Online_Green_dot.png"
//                           alt=""
//                         />
//                       )}
//                     </div>
//                     {/* <img
//                 src={e.is_group ? e.group_profile_image : e.profile_image}
//                 className="mr-3 h-10 w-10 rounded-full object-cover 2xl:h-12 2xl:w-12"
//                 alt=""
//               /> */}
//                     <div>
//                       <div className="text-base font-medium capitalize text-darkText">
//                         {e?.full_name}
//                       </div>

//                       <div className="flex items-center gap-x-1">
//                         {/* <LiaCheckDoubleSolid className="text-lg text-primary" /> */}
//                         <div className="line-clamp-1 flex w-full max-w-[12.5rem] gap-x-1 text-[13px] text-lightText">
//                           {e?.userDetails?.user_name}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="ml-auto grid h-full grid-cols-1 place-content-center gap-y-2 text-center">
//                       <MdCancel
//                         onClick={() => {
//                           dispatch(
//                             addOrRemoveUserId({
//                               user_id: e.userDetails.user_id,
//                             }),
//                           );
//                         }}
//                         className="h-5 w-5 text-[#FCC604]"
//                       />
//                     </div>
//                   </div>
//                   <hr className="border-t border-borderColor" />
//                 </>
//               );
//             })}

//           {/* {CreateGroup.user_id.length !== 0 && (
//             <div className="flex mt-auto mb-0 h-24 w-full items-end bg-gradient-to-t from-primary to-transparent">
//               <div
//                 onClick={() => {
//                   navigate("/create-group");
//                 }}
//                 className="primary-gradient mx-auto mb-5 w-[90%] cursor-pointer rounded-lg py-2 text-center"
//               >
//                 Done
//               </div>
//             </div>
//           )} */}
//         </div>
//         {CreateGroup.user_id.length !== 0 && (
//           <div className="bottom-0 flex h-24 w-full items-end bg-gradient-to-t from-primary to-transparent">
//             <div
//               onClick={() => {
//                 navigate("/create-group");
//               }}
//               className="primary-gradient mx-auto my-5 w-[90%] cursor-pointer rounded-lg py-2 text-center"
//             >
//               Done
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

import CreateGroupHeader from "./CreateGroupHeader";
import GroupProfileImage from "./GroupProfileImage";
import GroupNameInput from "./GroupNameInput";
import GroupMembersList from "./GroupMembersList";
import DoneButton from "./DoneButton";
import { useContactList } from "../../../store/api/useContactList";
import { useAppSelector } from "../../../utils/hooks";
import { useGroupSettings } from "../../../store/api/useGroupSettings";
import TextTranslate from "../../../utils/TextTranslate";

export default function Profile() {
  let { data: contactListUser } = useContactList({});
  let CreateGroup = useAppSelector((state) => state.CreateGroup);
  let { data: groupSettingsData } = useGroupSettings();

  return (
    <div className="relative flex h-[100dvh] min-w-80 flex-col bg-secondary shadow-inner 2xl:min-w-96">
      <div
        style={{
          backgroundSize: "100%",
        }}
        className="h-96 w-full space-y-5 bg-[url('/Home/profile_bg.png')] bg-no-repeat px-4 xl:space-y-7"
      >
        <CreateGroupHeader />
        <GroupProfileImage />
        <GroupNameInput />
      </div>

      <div className="mt-6 px-4">
        <TextTranslate text="Members" />: {CreateGroup.user_id.length} Out Of{" "}
        {groupSettingsData?.settings[0].max_members}
      </div>

      <GroupMembersList />
      <DoneButton />
    </div>
  );
}
