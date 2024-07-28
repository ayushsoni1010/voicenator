import { LiveClient, LiveSchema } from "@deepgram/sdk";

interface DeepgramWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

interface DeepgramAlternative {
  transcript: string;
  confidence: number;
  words: DeepgramWord[];
}

interface DeepgramChannel {
  alternatives: DeepgramAlternative[];
}

interface DeepgramModelInfo {
  name: string;
  version: string;
  arch: string;
}

interface DeepgramMetadata {
  request_id: string;
  model_info: DeepgramModelInfo;
  model_uuid: string;
}

interface DeepgramResult {
  type: string;
  channel_index: number[];
  duration: number;
  start: number;
  is_final: boolean;
  speech_final: boolean;
  channel: DeepgramChannel;
  metadata: DeepgramMetadata;
  from_finalize: boolean;
}

interface DeepgramClient {
  listen: {
    live: (options?: LiveSchema, endpoint?: string) => LiveClient;
  };
}

export type {
  DeepgramResult,
  DeepgramMetadata,
  DeepgramModelInfo,
  DeepgramChannel,
  DeepgramAlternative,
  DeepgramWord,
  DeepgramClient,
};
