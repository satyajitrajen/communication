// "use strict";

// /**
//  * Generates a single thumbnail image from a video file at a specified time.
//  * @param {File} videoFile - The video file from which to capture the thumbnail.
//  * @param {number} videoTimeInSeconds - The time (in seconds) in the video to capture the thumbnail.
//  * @returns {Promise<string>} - A promise that resolves to the thumbnail image as a base64-encoded string.
//  */
// const generateVideoThumbnail = (videoFile, videoTimeInSeconds = 0) => {
//   return new Promise((resolve, reject) => {
//     console.log("enter the generateVideoThumbnail");

//     if (!videoFile.type.includes("video")) {
//       return reject("File is not a valid video");
//     }

//     // Create a preview URL for the video file
//     const urlOfFile = URL.createObjectURL(videoFile);
//     const video = document.createElement("video");

//     // Set up video event listeners to capture the thumbnail
//     const captureThumbnail = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const context = canvas.getContext("2d");
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);
//       const image = canvas.toDataURL();

//       URL.revokeObjectURL(urlOfFile); // Clean up the object URL
//       resolve(image); // Resolve with the base64 image data
//     };

//     video.addEventListener("loadeddata", () => {
//       video.currentTime = videoTimeInSeconds;
//     });

//     video.addEventListener("seeked", captureThumbnail); // Capture thumbnail when the video reaches the specified time

//     video.preload = "metadata";
//     video.src = urlOfFile;
//     video.muted = true;
//     video.playsInline = true;
//   });
// };

// // Usage example
// // generateVideoThumbnail(file, 5) // Pass the video file and time (in seconds) for the thumbnail
// //   .then((thumbnail) => console.log("Thumbnail generated:", thumbnail))
// //   .catch((error) => console.error("Error generating thumbnail:", error));

"use strict";

/**
 * Generates a single thumbnail image from a video file at a specified time, with retries to prevent blank images.
 * @param {File} videoFile - The video file from which to capture the thumbnail.
 * @param {number} videoTimeInSeconds - The time (in seconds) in the video to capture the thumbnail.
 * @param {number} retries - Number of retries in case a blank image is captured (default: 3).
 * @returns {Promise<string>} - A promise that resolves to the thumbnail image as a base64-encoded string.
 */
const generateVideoThumbnail = (
  videoFile,
  videoTimeInSeconds = 0,
  retries = 3,
) => {
  return new Promise((resolve, reject) => {
    if (!videoFile.type.includes("video")) {
      return reject("File is not a valid video");
    }

    const urlOfFile = URL.createObjectURL(videoFile);
    const video = document.createElement("video");
    let retryCount = 0;

    const captureThumbnail = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL();

      // Check if image is blank and retry if necessary
      if (image.length > 100000 || retryCount >= retries) {
        URL.revokeObjectURL(urlOfFile);
        resolve(image);
      } else {
        retryCount++;
        console.warn(
          `Blank image detected. Retrying ${retryCount}/${retries}...`,
        );
        video.currentTime = videoTimeInSeconds; // Retry capturing at the specified time
      }
    };

    video.addEventListener("loadeddata", () => {
      video.currentTime = videoTimeInSeconds;
    });

    video.addEventListener("seeked", captureThumbnail);

    video.preload = "metadata";
    video.src = urlOfFile;
    video.muted = true;
    video.playsInline = true;
  });
};

export default generateVideoThumbnail;

// // Usage example
// generateVideoThumbnail(file, 5) // Pass the video file and time (in seconds) for the thumbnail
//   .then((thumbnail) => console.log("Thumbnail generated:", thumbnail))
//   .catch((error) => console.error("Error generating thumbnail:", error));
