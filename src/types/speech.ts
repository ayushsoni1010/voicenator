import { createSpeechEngine } from "@/lib/speech";

export type SpeechEngine = ReturnType<typeof createSpeechEngine>;

export type SpeechEngineState = {
  utterance: SpeechSynthesisUtterance | null;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  config: {
    rate: number;
    volume: number;
    pitch: number;
  };
  playState: SpeechEnginePlayState;
};

export type SpeechEngineOptions = {
  initialConfig?: Partial<SpeechEngineState["config"]>;
  onPlayStateChange?: (newState: SpeechEnginePlayState) => void;
  onBoundary?: (event: SpeechSynthesisEvent) => void;
  onEnd?: (event: SpeechSynthesisEvent) => void;
  onError?: (event: SpeechSynthesisEvent) => void;
  onMark?: (event: SpeechSynthesisEvent) => void;
  onPause?: (event: SpeechSynthesisEvent) => void;
  onResume?: (event: SpeechSynthesisEvent) => void;
  onStart?: (event: SpeechSynthesisEvent) => void;
};

export enum SpeechEnginePlayState {
  INIT = "init",
  IDLE = "idle",
  CONFIGURED = "configured",
  LOADING = "loading",
  PLAYING = "playing",
  PAUSED = "paused",
  STOPPED = "stopped",
  CANCELED = "canceled",
  FINISHED = "finished",
  ERROR = "error",
}

export type SpeechEnginePlayStateType =
  (typeof SpeechEnginePlayState)[keyof typeof SpeechEnginePlayState];
