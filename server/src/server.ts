import "dotenv/config";
import express from "express";
import http from "http";
import path from "path";
import { Server, Socket } from "socket.io";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import cors from "cors";
import Transcriber from "./services/transcriber.service";
import { DEEPGRAM_API_KEY } from "./constants";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY || "");
// let keepAlive: NodeJS.Timeout;

// const setupDeepgram = (socket: any) => {
//   const deepgram = deepgramClient.listen.live({
//     model: "nova-2",
//     punctuate: true,
//     language: "en",
//     smart_format: true,
//     interim_results: true,
//     diarize: false,
//     endpointing: 0,
//     encoding: "linear16",
//     sample_rate: 48000,
//   });

//   if (keepAlive) clearInterval(keepAlive);
//   keepAlive = setInterval(() => {
//     console.log("deepgram: keepalive");
//     deepgram.send("ping");
//   }, 10 * 1000);

//   deepgram.addListener(LiveTranscriptionEvents.Open, async () => {
//     console.log("deepgram: connected");

//     deepgram.addListener(LiveTranscriptionEvents.Transcript, (data: any) => {
//       console.log("first message", data?.channel?.alternatives);
//       console.log("deepgram: transcript received");
//       console.log("socket.io: transcript sent to client");
//       socket.emit("transcript", data);
//     });

//     deepgram.addListener(LiveTranscriptionEvents.Close, async () => {
//       console.log("deepgram: disconnected");
//       clearInterval(keepAlive);
//       deepgram.finish();
//     });

//     deepgram.addListener(LiveTranscriptionEvents.Error, async (error: any) => {
//       console.log("deepgram: error received");
//       console.error(error);
//     });

//     deepgram.addListener(LiveTranscriptionEvents.Metadata, (data: any) => {
//       console.log("deepgram: metadata received");
//       console.log("socket.io: metadata sent to client");
//       socket.emit("metadata", { metadata: data });
//     });
//   });

//   return deepgram;
// };

// io.on("connection", (socket) => {
//   console.log("socket.io: client connected");
//   let deepgram = setupDeepgram(socket);

//   socket.on("configure-stream", (data) => {
//     console.log(`configure-stream: ${JSON.stringify(data, null, 2)}`);
//     deepgram.send(JSON.stringify({ config: { sample_rate: data.sampleRate } }));
//   });

//   socket.on("incoming-audio", (audioData) => {
//     console.log("socket.io: client data received");

//     if (deepgram.getReadyState() === 1 /* OPEN */) {
//       console.log("socket.io: data sent to deepgram");
//       deepgram.send(audioData);
//     } else if (deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
//       console.log("socket.io: data couldn't be sent to deepgram");
//       console.log("socket.io: retrying connection to deepgram");
//       /* Attempt to reopen the Deepgram connection */
//       deepgram.finish();
//       deepgram.removeAllListeners();
//       deepgram = setupDeepgram(socket);
//     } else {
//       console.log("socket.io: data couldn't be sent to deepgram");
//     }
//   });

//   socket.on("stop-stream", async () => {
//     console.log("socket.io: client stopped the stream");
//     await deepgram.finish();
//   });

//   socket.on("disconnect", () => {
//     console.log("socket.io: client disconnected");
//     deepgram.finish();
//     deepgram.removeAllListeners();
//   });
// });

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  const transcriber = new Transcriber(DEEPGRAM_API_KEY!, socket);

  socket.on("configure-stream", (sampleRate: number) => {
    console.log(`configure-stream: ${sampleRate}`);
    transcriber.configureStream(sampleRate);
  });

  socket.on("incoming-audio", (audioData: Buffer) => {
    console.log("socket.io: client data received");
    transcriber.sendAudio(audioData);
  });

  socket.on("stop-stream", () => {
    console.log("socket.io: client stopped the stream");
    transcriber.stopStream();
  });

  socket.on("disconnect", () => {
    console.log("socket.io: client disconnected");
    transcriber.cleanup();
  });
});

app.use(cors({ credentials: false, origin: "*" }));
app.use(express.json());

const staticPath = path.resolve("public/");
app.use(express.static(staticPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(staticPath, "index.html"));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
