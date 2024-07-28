import React, { useState } from "react";
import { useSpeech } from "@/hooks/useSpeech";
import { SpeechEnginePlayState } from "@/types/speech";

const SpeechComponent: React.FC = () => {
  const [text, setText] = useState("");
  const {
    currentSentenceIdx,
    currentWordRange,
    playState,
    currentSentence,
    currentWord,
    play,
    pause,
    resume,
    cancel,
  } = useSpeech(text);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handlePlayPause = () => {
    if (playState === SpeechEnginePlayState.PLAYING) {
      pause();
    } else if (playState === SpeechEnginePlayState.PAUSED) {
      resume();
    } else {
      play();
    }
  };

  const getHighlightedText = (
    text: string,
    currentWordRange: [number, number]
  ) => {
    const [start, end] = currentWordRange;
    if (start === end) return text;

    return (
      <span>
        {text.substring(0, start)}
        <span className="text-blue-500">{text.substring(start, end)}</span>
        {text.substring(end)}
      </span>
    );
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={handleInputChange}
        placeholder="Enter text here..."
        rows={5}
        cols={50}
      />
      <div>
        <button onClick={handlePlayPause}>
          {playState === SpeechEnginePlayState.PLAYING
            ? "Pause"
            : playState === SpeechEnginePlayState.PAUSED
            ? "Resume"
            : "Play"}
        </button>
        <button onClick={cancel}>Cancel</button>
      </div>
      <div>
        <h3>Text:</h3>
        <p>{getHighlightedText(text, currentWordRange)}</p>
      </div>
    </div>
  );
};

export default SpeechComponent;
