import Image from "next/image";
import { useState } from "react";

type AvatarProps = {
  username: string;
  avatarUrl: string;
  size?: number;
};

/**
 * Can present avatars as gradients with letters, as pictures, or as a count (e.g +3)
 * Size, outline color, color, radius can all be changed, a status circle can be added
 */
export function Avatar({ username, avatarUrl, size = 52 }: AvatarProps) {
  const [pulse, setPulse] = useState(false);

  return (
    <div
      className="flex relative place-content-center select-none rounded-full"
      data-tooltip={username}
    >
      <div
        onClick={() => {
          if (!pulse) {
            setPulse(true);
            setTimeout(() => setPulse(false), 2000);
          }
        }}
      >
        <PictureCircle username={username} avatarUrl={avatarUrl} size={size} />
      </div>

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
