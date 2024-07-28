console.log("first");
import http from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import app from "./app";
import logger from "./utils/logger";
import { DEEPGRAM_API_KEY, PORT } from "./constants";
import {
  createClient,
  ListenLiveClient,
  LiveClient,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Handle socket connections
// io.on("connection", (socket) => {
//   logger.info(`New client connected: ${socket.id}`);
//   //   socketHandlers(socket);

//   socket.on("disconnect", () => {
//     logger.info(`Client disconnected: ${socket.id}`);
//   });
// });

const deepgramClient = createClient(DEEPGRAM_API_KEY);
let keepAlive: any;

const setupDeepgram = (socket: Socket) => {
  const deepgram: any = deepgramClient.listen.live({
    language: "en",
    punctuate: true,
    smart_format: true,
    model: "nova",
  });

  if (keepAlive) clearInterval(keepAlive);
  keepAlive = setInterval(() => {
    console.log("deepgram: keepalive");
    deepgram.keepAlive();
  }, 10 * 1000);

  deepgram.addListener(LiveTranscriptionEvents.Open, async () => {
    console.log("deepgram: connected");

    deepgram.addListener(LiveTranscriptionEvents.Transcript, (data: any) => {
      console.log("deepgram: packet received");
      console.log("deepgram: transcript received");
      console.log("socket: transcript sent to client");
      console.log(data, 101010);
      socket.send(JSON.stringify(data));
    });

    deepgram.addListener(LiveTranscriptionEvents.Close, async () => {
      console.log("deepgram: disconnected");
      clearInterval(keepAlive);
      deepgram.finish();
    });

    deepgram.addListener(LiveTranscriptionEvents.Error, async (error: any) => {
      console.log("deepgram: error received");
      console.error(error);
    });

    deepgram.addListener(LiveTranscriptionEvents.Metadata, (data: any) => {
      console.log("deepgram: packet received");
      console.log("deepgram: metadata received");
      console.log("ws: metadata sent to client");
      socket.send(JSON.stringify({ metadata: data }));
    });
  });

  return deepgram;
};

io.on("connection", (socket) => {
  logger.info(`New client connected: ${socket.id}`);

  let deepgram = setupDeepgram(socket);

  socket.on("message", (message) => {
    console.log("socket: client data received");

    if (deepgram.getReadyState() === 1 /* OPEN */) {
      console.log("socket: data sent to deepgram");
      deepgram.send(message);
    } else if (deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
      console.log("socket: data couldn't be sent to deepgram");
      console.log("socket: retrying connection to deepgram");
      /* Attempt to reopen the Deepgram connection */
      deepgram.finish();
      deepgram.removeAllListeners();
      deepgram = setupDeepgram(socket);
    } else {
      console.log("socket: data couldn't be sent to deepgram");
    }
  });

  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`);
    console.log("socket: client disconnected");
    deepgram.finish();
    deepgram.removeAllListeners();
    deepgram = null;
  });
});

// Start server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
