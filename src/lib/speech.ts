// lib/speech.ts
import {
  SpeechEngineState,
  SpeechEnginePlayState,
  SpeechEngineOptions,
} from "@/types/speech";

export const createSpeechEngine = (options: SpeechEngineOptions = {}) => {
  const state: SpeechEngineState = {
    utterance: null,
    voices: [],
    selectedVoice: null,
    config: {
      rate: options.initialConfig?.rate || 1,
      volume: options.initialConfig?.volume || 1,
      pitch: options.initialConfig?.pitch || 1,
    },
    playState: SpeechEnginePlayState.INIT,
  };

  const setPlayState = (newState: SpeechEnginePlayState) => {
    state.playState = newState;
    if (options.onPlayStateChange) {
      options.onPlayStateChange(newState);
    }
    console.log(`${newState} state`);
  };

  // Fetch and store voices
  const fetchVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    state.voices = voices;
    if (voices.length > 0) {
      state.selectedVoice = voices[0]; // Default to the first voice
    }
    setPlayState(SpeechEnginePlayState.CONFIGURED);
  };

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = fetchVoices;
  }

  // Initial fetching of voices
  fetchVoices();

  const load = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = state.config.rate;
    utterance.volume = state.config.volume;
    utterance.pitch = state.config.pitch;
    utterance.voice = state.selectedVoice;

    if (options.onBoundary) {
      console.log("Setting onBoundary event listener");
      utterance.onboundary = options.onBoundary;
    }
    if (options.onEnd) {
      console.log("Setting onEnd event listener");
      utterance.onend = (e) => {
        setPlayState(SpeechEnginePlayState.FINISHED);
        options.onEnd!(e);
      };
    }
    if (options.onError) {
      console.log("Setting onError event listener");
      utterance.onerror = options.onError;
    }
    if (options.onMark) {
      console.log("Setting onMark event listener");
      utterance.onmark = options.onMark;
    }
    if (options.onPause) {
      console.log("Setting onPause event listener");
      utterance.onpause = options.onPause;
    }
    if (options.onResume) {
      console.log("Setting onResume event listener");
      utterance.onresume = options.onResume;
    }
    if (options.onStart) {
      console.log("Setting onStart event listener");
      utterance.onstart = options.onStart;
    }

    state.utterance = utterance;
    setPlayState(SpeechEnginePlayState.LOADING);
  };

  const play = () => {
    if (!state.utterance) throw new Error("No active utterance found to play");

    setPlayState(SpeechEnginePlayState.PLAYING);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(state.utterance);
  };

  const pause = () => {
    if (state.playState === SpeechEnginePlayState.PLAYING) {
      setPlayState(SpeechEnginePlayState.PAUSED);
      window.speechSynthesis.pause();
    }
  };

  const cancel = () => {
    setPlayState(SpeechEnginePlayState.CANCELED);
    window.speechSynthesis.cancel();
  };

  const resume = () => {
    if (state.playState === SpeechEnginePlayState.PAUSED) {
      setPlayState(SpeechEnginePlayState.PLAYING);
      window.speechSynthesis.resume();
    }
  };

  const setVoice = (voice: SpeechSynthesisVoice) => {
    state.selectedVoice = voice;
  };

  const setRate = (rate: number) => {
    state.config.rate = rate;
  };

  const setVolume = (volume: number) => {
    state.config.volume = volume;
  };

  const setPitch = (pitch: number) => {
    state.config.pitch = pitch;
  };

  const searchVoices = (
    criteria: Partial<Pick<SpeechSynthesisVoice, "name" | "lang">>
  ) => {
    return state.voices.filter(
      (voice) =>
        (!criteria.name || voice.name.includes(criteria.name)) &&
        (!criteria.lang || voice.lang.includes(criteria.lang))
    );
  };

  return {
    state,
    play,
    pause,
    cancel,
    load,
    resume,
    setVoice,
    fetchVoices,
    setRate,
    setVolume,
    setPitch,
    searchVoices,
  };
};
