import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-around items-center h-full">
      <Link
        href="/prompt"
        className="hover:scale-[1.6] scale-150 transition-all duration-300 ease-in-out flex flex-col items-center justify-center"
      >
        <p>Prompt</p>
        <Image
          src="/sword2.png"
          alt="sword"
          width={30}
          height={30}
          quality={30}
          className="rounded-full border-2 border-amber-900 hover:border-amber-950 "
        />
      </Link>

      <Link
        href="/recorder"
        className="hover:scale-[1.6] scale-150 transition-all duration-300 ease-in-out flex flex-col items-center justify-center"
      >
        <p>Recorder</p>
        <Image
          src="/sword2.png"
          alt="sword"
          width={30}
          height={30}
          quality={30}
          className="rounded-full border-2 border-amber-900 hover:border-amber-950 "
        />
      </Link>

      <Link
        href="/story"
        className="hover:scale-[1.6] scale-150 transition-all duration-300 ease-in-out flex flex-col items-center justify-center"
      >
        <p>Story</p>
        <Image
          src="/sword2.png"
          alt="sword"
          width={30}
          height={30}
          quality={30}
          className="rounded-full border-2 border-amber-900 hover:border-amber-950 "
        />
      </Link>
    </div>
  );
}
