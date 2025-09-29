// @ts-nocheck
import { useState, useRef } from "react";
import { socketInstance } from "../socket/socket";
import { Device } from "mediasoup-client";
import { Transport } from "mediasoup-client/lib/types";

const useTransport = () => {
  const [sendTransport, setSendTransport] = useState<Transport>(null);
  const receiveTransportRef = useRef(null);

  const createSendTransport = (device: Device) => {
    return new Promise((resolve, reject) => {
      socketInstance().emit("createSendTransport", (response) => {
        console.log(response, "createSendTransport :response");
        console.log("child device", device);

        if (response.error) {
          reject(response.error);
        } else {
          const transport = device.createSendTransport(response.params);

          transport.on("connect", ({ dtlsParameters }, callback, errback) => {
            socketInstance().emit(
              "connectSendTransport",
              { dtlsParameters },
              (res) => {
                res.error ? errback(res.error) : callback();
              },
            );
          });

          transport.on("produce", (parameters, callback, errback) => {
            socketInstance().emit("produce", parameters, (res) => {
              res.error ? errback(res.error) : callback({ id: res.id });
            });
          });

          setSendTransport(transport);
          resolve(transport);
        }
      });
    });
  };

  const createReceiveTransport = (device: Device) => {
    if (receiveTransportRef.current) return receiveTransportRef.current;

    return new Promise((resolve, reject) => {
      socketInstance().emit("createRecvTransport", (response) => {
        if (response.error) {
          reject(response.error);
          return;
        }

        const transport = device.createRecvTransport(response.params);

        transport.on("connect", ({ dtlsParameters }, callback, errback) => {
          socketInstance().emit(
            "connectRecvTransport",
            { dtlsParameters },
            (res) => {
              res.error ? errback(res.error) : callback();
            },
          );
        });

        transport.on("connectionstatechange", (state) => {
          console.log("Transport state changed:", state);
          if (
            state === "closed" ||
            state === "failed" ||
            state === "disconnected"
          ) {
            console.log("Transport has been closed or lost connection.");
            // Handle transport closure (cleanup, UI updates, etc.)
          }
        });

        receiveTransportRef.current = transport;
        resolve(transport);
      });
    });
  };

  return { sendTransport, createSendTransport, createReceiveTransport };
};

export default useTransport;
