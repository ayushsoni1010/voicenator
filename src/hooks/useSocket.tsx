import { SERVER_URL } from "@/constants";
import { useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";

const subscriptions = [
  "final",
  "partial",
  "transcriber-ready",
  "error",
  "transcript",
] as const;

type SubscriptionType = (typeof subscriptions)[number];

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [transcription, setTranscription] = useState<string>("");

  const initialize = useCallback(() => {
    const _socket = io(SERVER_URL);
    setSocket(_socket);

    _socket.on("connect", () => {
      console.log("Connected");
    });

    _socket.on("welcome", (data: string) => {
      console.log(data);
    });
  }, []);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    } else {
      console.log("Socket is not connected yet.");
    }
  }, [socket]);

  const onError = useCallback(() => {
    if (socket) {
      socket.on("error", (error: string) => {
        console.log(`Error: ${error}`);
      });
      setSocket(null);
    } else {
      console.log("Socket is not initialized yet.");
    }
  }, [socket]);

  const initializeStream = useCallback(
    (sampleRate: number) => {
      if (socket) {
        socket.emit("configure-stream", { sampleRate });
      } else {
        console.log("Socket is not initialized yet.");
      }
    },
    [socket]
  );

  const sendStreamedAudio = useCallback(
    (data: Int16Array) => {
      if (socket) {
        socket.emit("incoming-audio", data);
      }
    },
    [socket]
  );

  const handleStartTranscription = useCallback(() => {
    if (socket) {
      subscriptions.forEach((subscription: SubscriptionType) => {
        socket.on(subscription, (data: any) => {
          console.log(`Received: ${subscription} ---> ${data}`);
          if (subscription === "transcript") {
            console.log(data, "received");
            setTranscription(
              (prev) => prev + data.channel.alternatives[0].transcript
            );
          }
        });
      });
    } else {
      console.log("Socket is not initialized yet.");
    }
  }, [socket]);

  return {
    socket,
    transcription,
    initialize,
    disconnect,
    onError,
    initializeStream,
    sendStreamedAudio,
    handleStartTranscription,
  };
};

export default useSocket;
