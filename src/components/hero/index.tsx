import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Header from "../header";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useSocket from "@/hooks/useSocket";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import { Textarea } from "../ui/textarea";
import { useSpeech } from "@/hooks/useSpeech";
import { SpeechEnginePlayState } from "@/types/speech";
import { Play } from "lucide-react";

const Hero: React.FunctionComponent = () => {
  const [data, setData] = useState<Int16Array | null>(null);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const cardsData = [
    {
      text: "Welcome to Voicenator. Voicenator can read to you in the highest quality digital available, anywhere.",
      img: "https://speechify.com/wp-content/uploads/2023/08/John.png",
      title: "John Doe",
    },
    {
      text: "Voicenator makes it easy to communicate in any language, anytime, anywhere.",
      img: "https://speechify.com/wp-content/uploads/2023/10/mrbeast.webp",
      title: "Mr. Beast",
    },
    {
      text: "Experience the future of communication with real-time translation and transcription.",
      img: "https://speechify.com/wp-content/uploads/2023/08/Gwyneth.png",
      title: "Gwyneth Paltrow",
    },
    {
      text: "Cut your reading time in half with Voicenator's advanced text-to-speech capabilities.",
      img: "https://hips.hearstapps.com/hmg-prod/images/gettyimages-1229892983-square.jpg",
      title: "Elon Musk",
    },
  ];

  const [playStates, setPlayStates] = useState<SpeechEnginePlayState[]>(
    Array(cardsData.length).fill(SpeechEnginePlayState.STOPPED)
  );
  // const [currentSentenceIdxs, setCurrentSentenceIdxs] = useState<number[]>(
  //   Array(cardsData.length).fill(0)
  // );
  const [currentWordRanges, _setCurrentWordRanges] = useState<
    [number, number][]
  >(Array(cardsData.length).fill([0, 0]));

  const speechHooks = cardsData.map((card, _index) => useSpeech(card.text));

  const {
    socket,
    initialize,
    handleStartTranscription,
    disconnect,
    initializeStream,
    sendStreamedAudio,
    transcription,
  } = useSocket();

  const {
    startRecording,
    stopRecording,
    isRecording,
    togglePauseResume,
    isPaused,
  } = useAudioRecorder({
    dataCb: (data: Int16Array) => {
      setData(data);
    },
  });

  useEffect(() => {
    if (socket === null) {
      initialize();
    }

    return () => {
      disconnect();
    };
  }, [initialize, disconnect, socket]);

  const handlePlayPause = (index: number) => {
    const currentPlayState = playStates[index];
    if (currentPlayState === SpeechEnginePlayState.PLAYING) {
      speechHooks[index].pause();
    } else if (currentPlayState === SpeechEnginePlayState.PAUSED) {
      speechHooks[index].resume();
    } else {
      speechHooks[index].play();
    }
    updatePlayState(index, currentPlayState);
  };

  const updatePlayState = (index: number, newState: SpeechEnginePlayState) => {
    const updatedPlayStates = [...playStates];
    updatedPlayStates[index] = newState;
    setPlayStates(updatedPlayStates);
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

  const onStartRecordingPress = async () => {
    try {
      const sampleRate = await startRecording();
      initializeStream(sampleRate);
      handleStartTranscription();
      setIsTranscribing(true);
    } catch (error) {
      console.log("Recording failed");
    }
  };

  const onStopRecordingPress = () => {
    stopRecording();
    setTimeout(() => {
      setIsTranscribing(false);
    }, 3000);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(transcription);
  };

  const handleClearText = () => {
    setData(null);
  };

  useEffect(() => {
    if (data) {
      sendStreamedAudio(data);
    }
  }, [data, sendStreamedAudio]);

  return (
    <main className="min-h-screen max-w-screen-2xl m-auto">
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <div className="grid grid-cols-2 gap-10">
          <img
            src="/assets/mockup.png"
            alt="Mockup"
            className="h-[37rem] object-cover"
            loading="lazy"
          />
          <div className="flex flex-col gap-10 items-center mx-auto max-w-[35rem]">
            <h1 className=" font-extrabold text-4xl leading-tight">
              Cut Your Reading Time in Half. Let Voicenator Read to You.
            </h1>
            <div className="grid grid-cols-2 gap-2">
              {cardsData.map((card, index) => (
                <Card className="max-w-72 p-2" key={index}>
                  <CardHeader className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={card.img} />
                          <AvatarFallback></AvatarFallback>
                        </Avatar>
                        <CardTitle>{card.title}</CardTitle>
                      </div>
                      <Button
                        onClick={() => handlePlayPause(index)}
                        variant={"outline"}
                        className="rounded-full p-2"
                        disabled={
                          playStates[index] === SpeechEnginePlayState.PLAYING
                        }
                        size={"icon"}
                      >
                        <Play />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2">
                    <p>
                      {getHighlightedText(card.text, currentWordRanges[index])}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  Try for free
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Speech to text</DialogTitle>
                  <DialogDescription>
                    Leverage Real-time transcription and translation of text.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <p>Start recording and say something.</p>
                  <Textarea
                    id="transcription-display"
                    rows={10}
                    cols={50}
                    value={transcription}
                    readOnly
                  ></Textarea>
                  <div className="flex gap-3 flex-wrap">
                    {!isRecording ? (
                      <Button
                        id="record-button"
                        onClick={onStartRecordingPress}
                      >
                        {!isTranscribing ? "Start Recording" : "Loading..."}
                      </Button>
                    ) : (
                      <Button id="record-button" onClick={onStopRecordingPress}>
                        {!isTranscribing ? "Stop Recording" : "Loading..."}
                      </Button>
                    )}
                    <Button onClick={togglePauseResume}>
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <Button id="copy-button" onClick={handleCopyClick}>
                      Copy
                    </Button>
                    <Button id="reset-button" onClick={handleClearText}>
                      Clear
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
