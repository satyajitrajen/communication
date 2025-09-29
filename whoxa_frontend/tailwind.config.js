/** @type {import('tailwindcss').Config} */
export default {
  content: ["/src/main.tsx", "./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        josefinSans: ["Josefin Sans"],
        Poppins: ["Poppins"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        borderColor: "var(--border-color)",
        lightText: "var(--light-text)", // here light text is white in dark mode and black in light mode
        darkText: "var(--dark-text)", // same like above
        selectedChat: "var(--selected-chat)",
        messageHead: "var(--message-head)",
        otherMessageBg: "var(--other-message-bg)",
        modalBg: "var(--modal-bg)",
        dropdownOptionHover: "var(--dropdown-option-hover)",
        selectedMessage: "var(--selected-message)",
        otherProfileSidebar: "var(--other-profile-sidebar)",
        pdfBg: "var(--pdf-bg)",
        attachIconBg: "var(--attachfile-icon-bg)",
        pinMessageListHeader: "var(--pin-messagelist-header)",
        pinMessageList: "var(--pin-messagelist)",
      },
    },
  },
};
