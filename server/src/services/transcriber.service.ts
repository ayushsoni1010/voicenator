import { EventEmitter } from "events";
import {
  createClient,
  LiveClient,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";
import { Socket } from "socket.io";
import { DeepgramClient, DeepgramResult } from "../types/deepgram";

class Transcriber extends EventEmitter {
  private deepgramClient: DeepgramClient;
  private keepAlive: NodeJS.Timeout | null = null;
  private deepgram!: LiveClient;
  private socket: Socket;

  constructor(apiKey: string, socket: Socket) {
    super();
    this.deepgramClient = createClient(apiKey) as unknown as DeepgramClient;
    this.socket = socket;
    this.setupListeners();
  }

  private setupListeners(): void {
    this.on("start", this.setupDeepgram.bind(this));
  }

  private setupDeepgram(): void {
    this.deepgram = this.deepgramClient.listen.live({
      model: "nova",
      punctuate: true,
      language: "en",
      interim_results: true,
      diarize: false,
      smart_format: true,
      endpointing: 0,
      encoding: "linear16",
      sample_rate: 48000,
    });

    if (this.keepAlive) clearInterval(this.keepAlive);
    this.keepAlive = setInterval(() => {
      if (this.deepgram) {
        console.log("deepgram: keepalive");
        this.deepgram.send("ping");
      }
    }, 10 * 1000);

    this.deepgram.on(LiveTranscriptionEvents.Open, () => {
      console.log("deepgram: connected");

      this.deepgram.on(
        LiveTranscriptionEvents.Transcript,
        (data: DeepgramResult) => {
          console.log("deepgram: transcript received");
          console.log("socket.io: transcript sent to client");
          console.log(data.channel.alternatives);
          this.socket.emit("transcript", data);
        }
      );

      this.deepgram.on(LiveTranscriptionEvents.Close, () => {
        console.log("deepgram: disconnected");
        if (this.keepAlive) clearInterval(this.keepAlive);
        this.deepgram?.requestClose();
      });

      this.deepgram.on(LiveTranscriptionEvents.Error, (error: Error) => {
        console.log("deepgram: error received");
        console.error(error);
      });

      this.deepgram.on(LiveTranscriptionEvents.Metadata, (data: any) => {
        console.log("deepgram: metadata received");
        console.log("socket.io: metadata sent to client");
        this.socket.emit("metadata", { metadata: data });
      });
    });
  }

  public configureStream(sampleRate: number): void {
    this.emit("start");
    this.deepgram?.send(
      JSON.stringify({ config: { sample_rate: sampleRate } })
    );
  }

  public sendAudio(buffer: Buffer): void {
    if (this.deepgram?.getReadyState() === 1 /* OPEN */) {
      console.log("socket.io: data sent to deepgram");
      this.deepgram.send(buffer);
    } else if (
      this.deepgram?.getReadyState()! >= 2 /* 2 = CLOSING, 3 = CLOSED */
    ) {
      console.log("socket.io: data couldn't be sent to deepgram");
      console.log("socket.io: retrying connection to deepgram");
      this.deepgram?.requestClose();
      this.deepgram?.removeAllListeners();
      this.setupDeepgram();
    } else {
      console.log("socket.io: data couldn't be sent to deepgram");
    }
  }

  public stopStream(): void {
    this.deepgram?.requestClose();
  }

  public cleanup(): void {
    if (this.deepgram) {
      this.deepgram.requestClose();
      this.deepgram.removeAllListeners();
    }
  }
}

export default Transcriber;
