"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Params = {
  lang: string;
  lucky_charm: string;
  animal: string;
  season: string;
};

export default function Prompt() {
  const router = useRouter();
  const [response, setResponse] = useState<string>("");
  const [params, setParams] = useState<Params>({
    lang: "",
    lucky_charm: "",
    animal: "",
    season: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const prompt = `
    Create a begining of a story about a ${params.animal} that is ${params.season} and has ${params.lucky_charm} as their lucky charm.
    The story should be in ${params.lang} language.
    the story must be less than 1000 characters.
    the story must be like a begining of a dongon and dragon story.
    It must finish by a question with a choice betwween two options.
    `;
    e.preventDefault();
    setResponse("Loading...");

    try {
      const res = await fetch("/api/LLM", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log({ data });
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
        <input
          type="text"
          placeholder="Lucky Charm"
          value={params.lucky_charm}
          onChange={(e) =>
            setParams({ ...params, lucky_charm: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Animal"
          value={params.animal}
          onChange={(e) => setParams({ ...params, animal: e.target.value })}
        />
        <input
          type="text"
          placeholder="Season"
          value={params.season}
          onChange={(e) => setParams({ ...params, season: e.target.value })}
        />
        <input
          type="text"
          placeholder="Language"
          value={params.lang}
          onChange={(e) => setParams({ ...params, lang: e.target.value })}
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
