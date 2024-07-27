import { useState, useEffect, useCallback } from "react";
import { createSpeechEngine } from "@/lib/speech";
import { SpeechEngine, SpeechEnginePlayState } from "@/types/speech";

export const useSpeech = (text: string) => {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [currentWordRange, setCurrentWordRange] = useState<[number, number]>([
    0, 0,
  ]);
  const [playState, setPlayState] = useState<SpeechEnginePlayState>(
    SpeechEnginePlayState.INIT
  );
  const [currentSentence, setCurrentSentence] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [speechEngine, setSpeechEngine] = useState<SpeechEngine | null>(null);

  useEffect(() => {
    const engine = createSpeechEngine({
      onBoundary: (event: SpeechSynthesisEvent) => {
        console.log("Boundary received: ", event);
        const word = text.substring(
          event.charIndex,
          event.charIndex + event.charLength
        );
        setCurrentWord(word);
        setCurrentWordRange([
          event.charIndex,
          event.charIndex + event.charLength,
        ]);
      },
      onEnd: () => {
        console.log("End received");
        setPlayState(SpeechEnginePlayState.FINISHED);
      },
      onError: (event: SpeechSynthesisEvent) => {
        console.error("Error received: ", event);
      },
      onMark: (event: SpeechSynthesisEvent) => {
        console.log("Mark received: ", event);
      },
      onPause: () => {
        console.log("Pause received");
        setPlayState(SpeechEnginePlayState.PAUSED);
      },
      onResume: () => {
        console.log("Resume received");
        setPlayState(SpeechEnginePlayState.PLAYING);
      },
      onStart: () => {
        console.log("Start received");
        setPlayState(SpeechEnginePlayState.PLAYING);
      },
    });
    setSpeechEngine(engine);

    return () => {
      if (speechEngine) {
        speechEngine.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (speechEngine && text) {
      speechEngine.load(text);
      setCurrentSentence(text);
      setCurrentSentenceIdx(0);
      setCurrentWordRange([0, 0]);
    }
  }, [speechEngine, text]);

  const play = useCallback(() => {
    if (speechEngine && playState !== SpeechEnginePlayState.PLAYING) {
      speechEngine.play();
      setPlayState(SpeechEnginePlayState.PLAYING);
    }
  }, [speechEngine, playState]);

  const pause = useCallback(() => {
    if (speechEngine && playState === SpeechEnginePlayState.PLAYING) {
      speechEngine.pause();
      setPlayState(SpeechEnginePlayState.PAUSED);
    }
  }, [speechEngine, playState]);

  const resume = useCallback(() => {
    if (speechEngine && playState === SpeechEnginePlayState.PAUSED) {
      speechEngine.resume();
      setPlayState(SpeechEnginePlayState.PLAYING);
    }
  }, [speechEngine, playState]);

  const cancel = useCallback(() => {
    if (speechEngine) {
      speechEngine.cancel();
      setPlayState(SpeechEnginePlayState.IDLE);
      setCurrentSentence(null);
      setCurrentWord(null);
      setCurrentSentenceIdx(0);
      setCurrentWordRange([0, 0]);
    }
  }, [speechEngine]);

  return {
    currentSentenceIdx,
    currentWordRange,
    playState,
    currentSentence,
    currentWord,
    play,
    pause,
    resume,
    cancel,
  };
};
