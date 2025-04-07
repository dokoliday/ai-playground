"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Prompt() {
  const router = useRouter();
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  enum Type {
    INITIAL = "initial",
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponse("Loading...");

    try {
      const res = await fetch("/api/LLM", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, type: Type.INITIAL }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResponse(data.message || "No result received");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error occurred while generating response");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        className="absolute top-1 left-1"
        type="button"
        onClick={() => router.push("/")}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-white text-2xl" />
      </button>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 rounded-md border-2 border-gray-300 bg-gray-100"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Generate
        </button>
      </form>
      {response && (
        <div>
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
