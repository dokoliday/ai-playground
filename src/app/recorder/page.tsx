"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
export default function Recorder() {
  const router = useRouter();
  const [recording, setRecording] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const startRecording = () => {
    setRecording(true);
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(mediaRecorder);

        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64Data = reader.result as string;
            const base64Audio = base64Data.split(",")[1];
            setAudioBuffer(base64Audio);
          };
        };

        mediaRecorder.start();
      });
  };

  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const sendAudioForTranscription = async () => {
    const response = await fetch("/api/transcription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio: audioBuffer }),
    });

    const data = await response.json();
    console.log("Transcription:", data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 relative">
      <button
        className="absolute top-1 left-1"
        type="button"
        onClick={() => router.push("/")}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-white text-2xl" />
      </button>
      <button
        onClick={startRecording}
        disabled={recording}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Start Recording
      </button>
      <button
        onClick={stopRecording}
        disabled={!recording}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Stop Recording
      </button>
      <button
        onClick={sendAudioForTranscription}
        disabled={!audioBuffer}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Transcribe
      </button>
    </div>
  );
}
