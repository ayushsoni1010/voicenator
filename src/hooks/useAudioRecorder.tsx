import { useState, useCallback, useRef } from "react";

interface UseAudioRecorderProps {
  dataCb?: (data: Int16Array) => void;
}

interface UseAudioRecorderReturn {
  startRecording: () => Promise<number>;
  stopRecording: () => void;
  togglePauseResume: () => void;
  isRecording: boolean;
  isPaused: boolean;
}

const useAudioRecorder = ({
  dataCb,
}: UseAudioRecorderProps): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [timerInterval, setTimerInterval] = useState<number | undefined>(
    undefined
  );
  const sourceNode = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
  const audioContext = useRef<AudioContext>(new AudioContext());

  const _startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setRecordingTime((time) => time + 1);
    }, 1000);
    setTimerInterval(interval as unknown as number);
  }, [setRecordingTime, setTimerInterval]);

  const _stopTimer = useCallback(() => {
    if (timerInterval !== undefined) {
      clearInterval(timerInterval);
      setTimerInterval(undefined);
    }
  }, [timerInterval, setTimerInterval]);

  const float32To16BitPCM = (float32Arr: Float32Array): Int16Array => {
    const pcm16bit = new Int16Array(float32Arr.length);
    for (let i = 0; i < float32Arr.length; ++i) {
      const s = Math.max(-1, Math.min(1, float32Arr[i]));
      pcm16bit[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm16bit;
  };

  const startRecording = async (): Promise<number> => {
    if (timerInterval != null) throw new Error("timerInterval not null");
    const isTesting = !navigator.mediaDevices;
    if (isTesting) {
      setIsRecording(true);
      return 24000;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext.current.resume();
    sourceNode.current = audioContext.current.createMediaStreamSource(stream);

    const chunkSize = 4096;
    scriptProcessor.current = audioContext.current.createScriptProcessor(
      chunkSize,
      1,
      1
    );

    scriptProcessor.current.onaudioprocess = (event) => {
      console.log(event);
      const inputBuffer = event.inputBuffer;
      const float32Audio = inputBuffer.getChannelData(0);
      const pcm16Audio = float32To16BitPCM(float32Audio);
      if (dataCb) {
        dataCb(pcm16Audio);
      }
    };

    sourceNode.current.connect(scriptProcessor.current);
    scriptProcessor.current.connect(audioContext.current.destination);

    setIsRecording(true);
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    recorder.start();
    _startTimer();
    return audioContext.current.sampleRate;
  };

  const stopRecording = () => {
    scriptProcessor.current?.disconnect();
    sourceNode.current?.disconnect();
    mediaRecorder?.stop();
    _stopTimer();
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
  };

  const togglePauseResume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      mediaRecorder?.resume();
      _startTimer();
    } else {
      setIsPaused(true);
      _stopTimer();
      mediaRecorder?.pause();
    }
  }, [isPaused, mediaRecorder, setIsPaused, _startTimer, _stopTimer]);

  return {
    startRecording,
    stopRecording,
    togglePauseResume,
    isRecording,
    isPaused,
  };
};

export default useAudioRecorder;
