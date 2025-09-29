import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import useApiPost from "../../hooks/PostData";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SignInWithGoogle() {
  const [userInfo, setUserInfo] = useState(null);
  const { loading, error, data, postData } = useApiPost();
  let navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
      fetchUserInfo(codeResponse.access_token);
    },
    flow: "implicit",
  });

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const userData = await response.json();
      // console.log("userData", userData);
      setUserInfo(userData);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const socialLogin = async () => {
    let formData = {
      firstname: userInfo?.given_name,
      lastname: userInfo?.family_name,
      email: userInfo?.email,
      login_type: "google",
      user_role: "user",
    };

    try {
      let response = await postData("social_login", formData);
      // console.log("response", response);
      if (response.success == "failure") {
        toast.error("Email or password is incorrect!");
        return;
      }
      // if (rememberMe) {
      Cookies.set("whoxa_auth_token", response.token);
      // }
      // Handle successful registration
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      socialLogin();
    }
  }, [userInfo]);

  return (
    <>
      <button
        onClick={login}
        className="border-2 border-borderColor cursor-pointer w-full flex gap-2 justify-center items-center py-1 font-medium rounded-lg"
      >
        <img
          src="/Home/google_logo.png"
          className="h-10 w-10 p-1"
          alt=""
        />
        <div>Signin with Google</div>
      </button>
      {/* {userInfo && (
        <div>
          <p>Email: {userInfo.email}</p>
          <img src={userInfo.picture} alt="Profile" />
        </div>
      )} */}
    </>
  );
}
