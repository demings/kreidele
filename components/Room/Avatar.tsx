import Image from "next/image";

type AvatarProps = {
  username: string;
  avatarUrl: string;
  statusColor?: string;
  size?: number;
  outlineColor?: string;
  outlineWidth?: number;
  borderRadius?: number;
  className?: string;
  style?: Record<string, string>;
};

/**
 * Can present avatars as gradients with letters, as pictures, or as a count (e.g +3)
 * Size, outline color, color, radius can all be changed, a status circle can be added
 */
export function Avatar({
  username,
  avatarUrl,
  size = 52,
  statusColor = "",
  outlineColor = "",
  outlineWidth = 0,
  borderRadius = 9999,
  style = {},
}: AvatarProps) {
  const realSize = size - outlineWidth * 2;

  return (
    <div
      style={{
        height: realSize,
        width: realSize,
        boxShadow: `${outlineColor} 0 0 0 ${outlineWidth}px`,
        margin: outlineWidth,
        borderRadius,
        ...style,
      }}
      className="flex relative place-content-center"
      data-tooltip={username}
    >
      <PictureCircle
        username={username}
        avatarUrl={avatarUrl}
        size={realSize}
        borderRadius={borderRadius}
      />

      {statusColor ? (
        <span
          style={{ backgroundColor: statusColor }}
          className="block absolute right-0 bottom-0 w-2 h-2 rounded-full"
        />
      ) : null}
    </div>
  );
}

function PictureCircle({
  username,
  avatarUrl,
  size,
  borderRadius,
}: Pick<AvatarProps, "username" | "avatarUrl" | "size" | "borderRadius">) {
  return (
    <Image
      alt={username}
      src={avatarUrl}
      height={size}
      width={size}
      style={{ borderRadius }}
    />
  );
}
