import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Initialize the pipeline at request time
  const { pipeline } = await import("@xenova/transformers");
  const transcriber = await pipeline(
    "automatic-speech-recognition",
    "Xenova/whisper-tiny.en"
  );
  try {
    const { audio } = await request.json();

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, "base64");
    const filePath = path.join(process.cwd(), `${Date.now()}.wav`);
    fs.writeFile(filePath, audioBuffer);

    // Convert to Float32Array

    // Convert to Float32Array
    const floatArray = new Float32Array(audioBuffer.length);
    // for (let i = 0; i < audioBuffer.length; i++) {
    //   floatArray[i] = (audioBuffer[i] - 128) / 128;
    // }

    const output = await transcriber(floatArray);

    return NextResponse.json({
      transcription: output || "No transcription result",
      debug: {
        bufferLength: audioBuffer.length,
        floatLength: floatArray.length,
        sampleValues: Array.from(floatArray.slice(0, 5)),
      },
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      {
        error: "Transcription failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
