import { useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";

const serverURL = "http://localhost:8080";

const subscriptions = [
  "final",
  "partial",
  "transcriber-ready",
  "error",
] as const;

type SubscriptionType = (typeof subscriptions)[number];

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const initialize = useCallback(() => {
    const _socket = io(serverURL);
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
        socket.on(subscription, (data: string) => {
          console.log(`Received: ${subscription} ---> ${data}`);
        });
      });
    } else {
      console.log("Socket is not initialized yet.");
    }
  }, [socket]);

  return {
    socket,
    initialize,
    disconnect,
    onError,
    initializeStream,
    sendStreamedAudio,
    handleStartTranscription,
  };
};

export default useSocket;
