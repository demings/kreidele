import { ArrowPathIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

export const generateRandomAvatarUrl = () => {
  return `https://avatars.dicebear.com/api/personas/${(Math.random() + 1)
    .toString(36)
    .substring(7)}.svg`;
};

interface AvatarSelectionProps {
  setAvatarUrl: (url: string) => void;
  avatarUrl: string;
}

const AvatarSelection = ({ setAvatarUrl, avatarUrl }: AvatarSelectionProps) => {
  const [spin, setSpin] = useState(false);

  return (
    <>
      <div className="flex select-none">
        <div className="mb-8">
          <Image
            // loader={myLoader}
            src={avatarUrl}
            alt="Jūsų avataras"
            width={142}
            height={142}
          />
        </div>
        <ArrowPathIcon
          className={`w-16 fill-slate-900 cursor-pointer ${
            spin ? "animate-spin" : ""
          }`}
          onClick={() => {
            if (!spin) {
              setAvatarUrl(generateRandomAvatarUrl());
              setSpin(true);
              setTimeout(() => setSpin(false), 500);
            }
          }}
        />
      </div>
    </>
  );
};

export default AvatarSelection;
