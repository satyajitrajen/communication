async function compressVideo(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;  // Maintain original width
      canvas.height = video.videoHeight; // Maintain original height

      // Determine codec and bitrate based on browser support
      let options;
      if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
        // Use VP9 codec with higher bitrate for better quality on supported browsers
        options = {
          mimeType: 'video/webm; codecs=vp9',
          videoBitsPerSecond: 5000000, // Higher bitrate for VP9
        };
      } else {
        // Use VP8 codec with lower bitrate for broader compatibility
        options = {
          mimeType: 'video/webm; codecs=vp8',
          videoBitsPerSecond: 5000000, // Lower bitrate for VP8
        };
      }

      try {
        const stream = canvas.captureStream();
        const mediaRecorder = new MediaRecorder(stream, options);
        let chunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const compressedVideoBlob = new Blob(chunks, { type: 'video/webm' });
          resolve(compressedVideoBlob);
        };

        mediaRecorder.start();

        const drawFrame = () => {
          if (video.paused || video.ended) {
            mediaRecorder.stop();
            return;
          }
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(drawFrame);
        };

        video.onplay = () => {
          drawFrame();
        };

        video.play();
      } catch (error) {
        reject(`Compression failed: ${error}`);
      }
    };

    video.onerror = (error) => {
      reject(`Video loading error: ${error}`);
    };
  });
}


export default compressVideo;
