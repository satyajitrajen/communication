// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import * as mediasoupClient from "mediasoup-client";
import useTransport from "./useTransport";
import useMediaStreams from "./useMediaStreams";
import { socketInstance } from "../socket/socket";

const useMediaSoup = () => {
  const { localStream } = useMediaStreams();
  const [remoteStreams, setRemoteStreams] = useState([]);
  const deviceRef = useRef(null);
  const rtpCapabilitiesRef = useRef(null);
  const { sendTransport, createSendTransport, createReceiveTransport } =
    useTransport();

  useEffect(() => {
    const initializeMediaSoup = async () => {
      try {
        const rtpCapabilities = await getRtpCapabilities();
        rtpCapabilitiesRef.current = rtpCapabilities;

        const device = new mediasoupClient.Device();
        await device.load({ routerRtpCapabilities: rtpCapabilities });

        deviceRef.current = device;
        await createSendTransport(device);
        await createReceiveTransport(device);
        // Fetch existing producers once device is initialized
        fetchExistingProducers();
      } catch (error) {
        console.error("Error initializing MediaSoup:", error);
      }
    };

    initializeMediaSoup();

    socketInstance().on("newProducer", async ({ producerId }) => {
      try {
        if (!deviceRef.current)
          return console.error("MediaSoup device not initialized.");

        const rcvTransport = await createReceiveTransport();
        const consumer = await consumeMedia(rcvTransport, producerId);

        const remoteStream = new MediaStream();
        remoteStream.addTrack(consumer.track);
        remoteStream.producerId = producerId;
        remoteStream.type = consumer.kind;

        setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
      } catch (error) {
        console.error("Error handling new producer:", error);
      }
    });
    socketInstance().on("removeProducer", ({ producerId }) => {
      // console.log(`Producer removed: ${producerId}`);

      // Find and remove the video element associated with the producer
      const videoElement = document.querySelector(
        `[data-producer-id="${producerId}"]`,
      );
      if (videoElement) {
        videoElement.remove();
      }
    });
  }, []);

  const consumeMedia = async (rcvTransport, producerId) => {
    const response = await new Promise((resolve, reject) => {
      socketInstance().emit(
        "consume",
        { producerId, rtpCapabilities: rtpCapabilitiesRef.current },
        (res) => (res.error ? reject(res.error) : resolve(res)),
      );
    });

    return await rcvTransport.consume({
      id: response.id,
      producerId: response.producerId,
      kind: response.kind,
      rtpParameters: response.rtpParameters,
    });
  };

  const getRtpCapabilities = () => {
    return new Promise((resolve, reject) => {
      socketInstance().emit("getRtpCapabilities", (response) => {
        response.error
          ? reject(response.error)
          : resolve(response.rtpCapabilities);
      });
    });
  };

  const consumeExistingProducer = async (producerId) => {
    try {
      const device = deviceRef.current;
      if (!device) throw new Error("MediaSoup device not initialized.");

      const rcvTransport = await createReceiveTransport(device);

      const consumer = await consumeMedia(rcvTransport, producerId);

      const { track } = consumer;
      const remoteStream = new MediaStream();
      remoteStream.addTrack(track);
      remoteStream.producerId = producerId;
      remoteStream.type = consumer.kind;

      setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
    } catch (error) {
      console.error("Error consuming existing producer:", error);
    }
  };

  const fetchExistingProducers = async () => {
    socketInstance().emit("getExistingProducers", async (response) => {
      if (response.success) {
        try {
          for (const { producerId } of response.producers) {
            await consumeExistingProducer(producerId);
          }
        } catch (error) {
          console.error("Error processing producers:", error);
        }
      } else {
        console.error("Error fetching existing producers:", response.error);
      }
    });
  };

  return { localStream, remoteStreams, sendTransport };
};

export default useMediaSoup;
