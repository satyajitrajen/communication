import { store } from "./store/store";
import { Provider } from "react-redux";
import AppRoutes from "./pages/Routes";
import ScrrollToTop from "../src/components/ScrrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeProvider";
// import { disconnectSocket, initiateSocketConnection } from "./socket/socket";
import Cookies from "js-cookie";
import { FileProvider } from "./context/FileProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { StreamProvider } from "./context/StreamProvider";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // ✅ disable retries
        refetchOnWindowFocus: false, // optional: disable on window focus
        refetchOnReconnect: false, // optional
        refetchOnMount: false, // optional
      },
    },
  });
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const token = Cookies.get("whoxa_auth_token");

    if (!token) {
      if (
        location.pathname != "/privacy-policy" &&
        location.pathname != "/otp-verification"
      ) {
        navigate("/login");
      }
      // Cookies.set(
      //   "whoxa_auth_token",
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJwaG9uZV9udW1iZXIiOiI3NDMzMDcyMzUxIiwiY291bnRyeSI6ImluZGlhIiwiZmlyc3RfbmFtZSI6IlBhd2FuIiwibGFzdF9uYW1lIjoiUGF0ZWwiLCJkZXZpY2VfdG9rZW4iOiJkUHBFZ1JPUFJoQzlEX1Y0Um1teENTOkFQQTkxYkZVWDhDc2Y5SFctbFB6UmRNdVptaHNGSTFxS3RXZWRhTTBQeFV6QmZTZE92SW5fY19MZHU1UVBDLTF5NGtpc0E5dnExelVBN3pxOGdTblh3cFp1WXhlemxjMkJHNThjLVlDdHJObUZhQWdWNTVxNHBrVDNOQTctWEh4NVlIZ3JZenJXS3RDIiwib25lX3NpZ25hbF9wbGF5ZXJfaWQiOiIyMzI4NjA3MC0wNzRhLTRhYWMtYmE5My01M2RjZGNmZjk4MDUiLCJ1c2VyX25hbWUiOiJwYXdhbjE4MTciLCJiaW8iOiJBdCB3b3JrIiwiZG9iIjoiMCIsImNvdW50cnlfY29kZSI6Iis5MSIsInBhc3N3b3JkIjoiIiwibGFzdF9zZWVuIjowLCJvdHAiOjY2ODMyMCwiZ2VuZGVyIjoibWFsZSIsInByb2ZpbGVfaW1hZ2UiOiJ1cGxvYWRzL290aGVycy8xNzI3MjcxOTkxNTA3LXdwMTIxNDU3MTEtbWFyd2FyaS1ob3JzZS13YWxscGFwZXJzLmpwZyIsIkJsb2NrZWRfYnlfYWRtaW4iOmZhbHNlLCJ2aWV3ZWRfYnlfYWRtaW4iOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDI0LTA2LTA3VDEwOjEyOjA5LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDI0LTEwLTA0VDA2OjQ3OjM4LjAwMFoiLCJpYXQiOjE3MjgwMjQ0ODJ9.vcghBB-zzrklnUqgeN-ADI_Vw27sULLppEuYv2Lqv_4",
      // );
    }
  }, []);

  useEffect(() => {
    sessionStorage.removeItem("callStartTime");
  }, []);

  return (
    <>
      {/* Set meta tags with react-helmet ====================================================================================*/}
      <Helmet>
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Whoxa web chat" />
        <meta
          property="og:description"
          content="Boost your business with an affordable, customizable WhatsApp Web clone that enhances communication and drives growth effortlessly."
        />
        <meta property="og:url" content="https://whoxachat.com/" />
        <meta property="og:site_name" content="Whoxa web chat" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/primocys/image/upload/v1732606603/Chat_web_banner/Overview_kq7dcg.jpg"
        />
      </Helmet>
      <ScrrollToTop />
      <Provider store={store}>
        <ThemeProvider>
          <StreamProvider>
            <QueryClientProvider client={queryClient}>
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_Google_Client_ID}
              >
                <FileProvider>
                  <AppRoutes />
                </FileProvider>
              </GoogleOAuthProvider>
            </QueryClientProvider>
          </StreamProvider>
        </ThemeProvider>
      </Provider>
      <Toaster
        toastOptions={{ duration: 3000 }}
        position="bottom-right"
        reverseOrder={false}
      />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
