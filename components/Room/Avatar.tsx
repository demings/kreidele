import Image from "next/image";
import { useMemo } from "react";
import { getContrastingColor } from "../../shared/utils";
import styles from "./Avatars.module.css";

type BothProps = {
  variant?: "avatar" | "more";
  size?: number;
  outlineColor?: string;
  outlineWidth?: number;
  borderRadius?: number;
  className?: string;
  style?: Record<string, string>;
  avatarUrl?: string;
};

type PictureProps = BothProps & {
  variant?: "avatar";
  name?: string;
  picture?: string;
  color: [string, string];
  statusColor?: string;
  count?: never;
};

type MoreProps = BothProps & {
  variant: "more";
  count: number;
  picture?: never;
  name?: never;
  statusColor?: never;
  color?: never;
};

type AvatarProps = PictureProps | MoreProps;

/**
 * Can present avatars as gradients with letters, as pictures, or as a count (e.g +3)
 * Size, outline color, color, radius can all be changed, a status circle can be added
 */
export function Avatar({
  variant = "avatar",
  picture = "",
  name = "",
  color = ["", ""],
  size = 52,
  statusColor = "",
  outlineColor = "",
  outlineWidth = 3,
  borderRadius = 9999,
  style = {},
  count = 0,
  avatarUrl,
}: AvatarProps) {
  const innerVariant = !picture && !avatarUrl ? "letter" : variant;
  const realSize = size - outlineWidth * 2;

  // console.log({ innerVariant, picture, avatarUrl });

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
      className={styles.avatar}
      data-tooltip={name}
    >
      {innerVariant === "more" ? (
        <MoreCircle count={count} borderRadius={borderRadius} />
      ) : null}

      {innerVariant === "avatar" ? (
        <PictureCircle
          name={name}
          picture={avatarUrl ?? picture}
          size={realSize}
          borderRadius={borderRadius}
        />
      ) : null}

      {innerVariant === "letter" ? (
        <LetterCircle name={name} color={color} borderRadius={borderRadius} />
      ) : null}

      {statusColor ? (
        <span
          style={{ backgroundColor: statusColor }}
          className={styles.status}
        />
      ) : null}
    </div>
  );
}

function LetterCircle({
  name,
  color,
  borderRadius,
}: Pick<PictureProps, "name" | "color" | "borderRadius">) {
  const textColor = useMemo(
    () => (color ? getContrastingColor(color[1]) : undefined),
    [color]
  );
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${color[0]}, ${color[1]})`,
        borderRadius,
      }}
      className={styles.letter}
    >
      <div className={styles.letterCharacter} style={{ color: textColor }}>
        {name ? name.charAt(0) : null}
      </div>
    </div>
  );
}

function PictureCircle({
  name,
  picture = "",
  size,
  borderRadius,
}: Pick<PictureProps, "name" | "picture" | "size" | "borderRadius">) {
  return (
    <Image
      alt={name}
      src={picture}
      height={size}
      width={size}
      style={{ borderRadius }}
    />
  );
}

function MoreCircle({
  count,
  borderRadius,
}: Pick<MoreProps, "count" | "borderRadius">) {
  return (
    <div style={{ borderRadius }} className={styles.more}>
      +{count}
    </div>
  );
}
