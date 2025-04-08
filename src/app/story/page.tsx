"use client";
import { useState } from "react";
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
  const [story, setStory] = useState<string>("");
  const [round, setRound] = useState<number>(0);
  const [choice, setChoice] = useState<"A" | "B">("A");
  const [params, setParams] = useState<Params>({
    lang: "french",
    lucky_charm: "a lucky charm",
    animal: "a dragon",
    season: "spring",
  });

  const handleSubmit = async () => {
    const prompts = [
      `
    Create a begining of an epic adventure story about you and your pet , a  ${params.animal}, the current seson is ${params.season} and you bring your own lucky charm, a ${params.lucky_charm}  .
    The story should be in ${params.lang} language in the hight writer level style.
    the story must be less than 100 characters.
    It must finish by a question with a choice betwween two clear option A and B need to continu the story.
    `,
      `
    this was the story: ${story}
    continue the story with the choice ${choice}
    The story should be in ${params.lang} language.
    the story must be less than 50 characters.
    It must finish by a question with a choice betwween two clearr option A and B.
    `,
      `
     this was the story: ${story}
     continue the story with the choice ${choice}
     The story should be in ${params.lang} language.
     the story must be less than 50 characters.
     It must finish by a question with a choice betwween two clearr option A and B.
     `,
      `
    this is the end of the story the story: ${story}
    give me a random happy or negative ending.
     The story should be in ${params.lang} language.
     the story must be less than 50 characters.
     `,
    ];
    setResponse("Loading...");
    console.log({ round, choice });
    try {
      const res = await fetch("/api/LLM", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompts[round] }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResponse(data.message || "No result received");
      setStory(story + data.message);

      setRound(round + 1);
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
      {round === 0 && (
        <div className="flex flex-col gap-2">
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
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Generate
          </button>
        </div>
      )}
      {round > 0 && round < 2 && (
        <div className="flex gap-2 ">
          <button
            onClick={() => {
              setChoice("A");
              handleSubmit();
            }}
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md w-1/2"
          >
            A
          </button>
          <button
            onClick={() => {
              setChoice("B");
              handleSubmit();
            }}
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md w-1/2"
          >
            B
          </button>
        </div>
      )}
      {response && (
        <div>
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
