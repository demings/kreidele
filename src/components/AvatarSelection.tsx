import { ArrowPathIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export const generateRandomAvatarUrl = () => {
  return `https://avatars.dicebear.com/api/personas/${(Math.random() + 1)
    .toString(36)
    .substring(7)}.svg?background=%23e2e8f0`;
};

interface AvatarSelectionProps {
  setAvatarUrl: (url: string) => void;
  avatarUrl: string;
}

const AvatarSelection = ({ setAvatarUrl, avatarUrl }: AvatarSelectionProps) => {
  return (
    <>
      <div className="flex mb-2 select-none">
        <Image
          // loader={myLoader}
          src={avatarUrl}
          alt="Jūsų avataras"
          width={100}
          height={100}
        />
        <ArrowPathIcon
          className="w-8 fill-slate-900 hover:animate-spin cursor-pointer"
          onClick={() => setAvatarUrl(generateRandomAvatarUrl())}
        />
      </div>
    </>
  );
};

export default AvatarSelection;
