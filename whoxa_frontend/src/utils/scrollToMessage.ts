// const scrollToMessage = (messageId: number) => {
//   // console.log(messageId);

//   const element = document.getElementById(String(messageId));
//   // console.log(element, "element++++++++++++++++++++==");

//   if (element) {
//     element.scrollIntoView({ behavior: "smooth" });
//     element.classList.add("bg-selectedMessage");
//     setTimeout(() => {
//       element.classList.remove("bg-selectedMessage");
//     }, 3500);
//   }
// };

// export default scrollToMessage;

// Second method ==================================================================================

const scrollToMessage = (
  messageId: number,
  highlith_message?: boolean,
  smooth_scroll?: boolean,
) => {
  const element = document.getElementById(String(messageId));

  if (element) {
    // Get the parent container that has the scrollable content
    const parentContainer = document.querySelector("#messageListDiv");

    if (parentContainer) {
      // Calculate the distance from the top of the parent to the target element
      const scrollPosition = element.offsetTop - parentContainer.offsetTop - 55; // Adjust 55 for your fixed header height if needed

      // Smoothly scroll to the calculated position
      parentContainer.scrollTo({
        top: scrollPosition,
        behavior: smooth_scroll ? "smooth" : "instant",
      });
      if (highlith_message) {
        // Highlight the message temporarily
        element.classList.add("bg-selectedMessage");
        setTimeout(() => {
          element.classList.remove("bg-selectedMessage");
        }, 3500);
      }
    }
  }
};

export default scrollToMessage;
