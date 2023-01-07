import Image from "next/image";
import { useState } from "react";

type AvatarProps = {
  username: string;
  avatarUrl: string;
  size?: number;
  drawing: boolean;
};

/**
 * Can present avatars as gradients with letters, as pictures, or as a count (e.g +3)
 * Size, outline color, color, radius can all be changed, a status circle can be added
 */
export function Avatar({
  username,
  avatarUrl,
  drawing,
  size = 52,
}: AvatarProps) {
  const [pulse, setPulse] = useState(false);

  const triggerPulse = () => {
    {
      if (!pulse) {
        setPulse(true);
        setTimeout(() => setPulse(false), 2000);
      }
    }
  };

  return (
    <div
      className="flex relative place-content-center select-none rounded-full"
      data-tooltip={username}
    >
      <div onClick={triggerPulse}>
        <PictureCircle username={username} avatarUrl={avatarUrl} size={size} />
      </div>

      {drawing && (
        <svg className="absolute right-1 bottom-0 w-5 h-5 fill-amber-800">
          <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
        </svg>
      )}

      {pulse && (
        <span className="bg-green-600 block absolute right-2 bottom-0 w-2 h-2 rounded-full animate-pulse-bg-once" />
      )}
    </div>
  );
}

function PictureCircle({
  username,
  avatarUrl,
  size,
}: Pick<AvatarProps, "username" | "avatarUrl" | "size">) {
  return (
    <Image
      alt={username}
      src={avatarUrl}
      height={size}
      width={size}
      className="rounded-full"
    />
  );
}
