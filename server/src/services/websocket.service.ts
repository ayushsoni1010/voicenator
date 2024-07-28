import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";
import Transcriber from "./transcriber.service";
import { DEEPGRAM_API_KEY } from "../constants";

export class SocketService {
  private io: SocketIOServer;

  constructor(server: http.Server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
  }

  public init(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("socket.io: client connected");

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
  }
}

export default SocketService;
