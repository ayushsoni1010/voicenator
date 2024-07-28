// import { useEffect, useState } from "react";
// import useAudioRecorder from "./hooks/useAudioRecorder";
// import useSocket from "./hooks/useSocket";
// import Header from "./components/header";
import { BrowserRouter } from "react-router-dom";
import Hero from "./components/hero";

function App() {
  // const {
  //   socket,
  //   initialize,
  //   handleStartTranscription,
  //   disconnect,
  //   initializeStream,
  //   sendStreamedAudio,
  //   transcription,
  // } = useSocket();

  // const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  // const [data, setData] = useState<Int16Array | null>(null);

  // useEffect(() => {
  //   if (socket === null) {
  //     initialize();
  //   }

  //   return () => {
  //     disconnect();
  //   };
  // }, [initialize, disconnect, socket]);

  // useEffect(() => {
  //   if (data) {
  //     sendStreamedAudio(data);
  //   }
  // }, [data, sendStreamedAudio]);

  // const {
  //   startRecording,
  //   stopRecording,
  //   isRecording,
  //   togglePauseResume,
  //   isPaused,
  // } = useAudioRecorder({
  //   dataCb: (data: Int16Array) => {
  //     setData(data);
  //   },
  // });

  // const onStartRecordingPress = async () => {
  //   try {
  //     const sampleRate = await startRecording();
  //     initializeStream(sampleRate);
  //     handleStartTranscription();
  //     setIsTranscribing(true);
  //   } catch (error) {
  //     console.log("Recording failed");
  //   }
  // };

  // const onStopRecordingPress = () => {
  //   stopRecording();
  //   setTimeout(() => {
  //     setIsTranscribing(false);
  //   }, 3000);
  // };

  // const handleCopyClick = () => {
  //   navigator.clipboard.writeText(transcription);
  // };

  // const handleClearText = () => {
  //   setData(null);
  // };

  return (
    <BrowserRouter>
      <Hero />
      {/* <h1>Speechify Voice Notes</h1>
      <p>Record or type something in the textbox.</p>
      <textarea
        id="transcription-display"
        rows={10}
        cols={50}
        value={transcription}
        readOnly
      ></textarea>
      {!isRecording ? (
        <button id="record-button" onClick={onStartRecordingPress}>
          {!isTranscribing ? "Start Recording" : "Loading..."}
        </button>
      ) : (
        <button id="record-button" onClick={onStopRecordingPress}>
          {!isTranscribing ? "Stop Recording" : "Loading..."}
        </button>
      )}
      <button onClick={togglePauseResume}>
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button id="copy-button" onClick={handleCopyClick}>
        Copy
      </button>
      <button id="reset-button" onClick={handleClearText}>
        Clear
      </button> */}
    </BrowserRouter>
  );
}

export default App;
