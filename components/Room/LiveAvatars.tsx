import { AnimatePresence, motion } from "framer-motion";
import { useOthersMapped, useSelf } from "../../liveblocks.config";
import { Avatar } from "./Avatar";

/**
 * This file shows how to add live avatars like you can see them at the top right of a Google Doc or a Figma file.
 *
 * The users picture and name are not set via the `useMyPresence` hook like the cursors.
 * They are set from the authentication endpoint.
 *
 * See pages/api/auth.ts and https://liveblocks.io/docs/api-reference/liveblocks-node#authorize for more information
 */

const MAX_OTHERS = 3;

const animationProps = {
  initial: { width: 0, transformOrigin: "left" },
  animate: { width: "auto", height: "auto" },
  exit: { width: 0 },
  transition: {
    type: "spring",
    damping: 15,
    mass: 1,
    stiffness: 200,
    restSpeed: 0.01,
  },
};

const avatarProps = {
  style: { marginLeft: "-0.45rem" },
  size: 48,
  outlineWidth: 3,
  outlineColor: "white",
};

interface AvatarInfo {
  picture: string;
  name: string;
  color: [string, string];
}

export function LiveAvatars() {
  //
  // RATIONALE:
  // Using useOthersMapped here and only selecting/subscribing to the "info"
  // part of each user, which is static data that won't change (unlike
  // presence). In this example we don't use presence, but in a real app this
  // makes a difference: if we did not use a selector function here, these
  // avatars would get needlessly re-rendered any time any of the others moved
  // their cursors :)
  //
  const others = useOthersMapped((other) => other.info);
  const currentUser = useSelf();
  const hasMoreUsers = others.length > MAX_OTHERS;

  return (
    <div
      style={{
        minHeight: avatarProps.size + "px",
        display: "flex",
        paddingLeft: "0.75rem",
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
        {hasMoreUsers ? (
          <motion.div key="count" {...animationProps}>
            <Avatar {...avatarProps} variant="more" count={others.length - 3} />
          </motion.div>
        ) : null}

        {others
          .slice(0, MAX_OTHERS)
          .reverse()
          .map(([key, info]) => {
            return (
              <motion.div key={key} {...animationProps}>
                <AvatarFromInfo info={info as any as AvatarInfo} />
              </motion.div>
            );
          })}

        {currentUser ? (
          <motion.div key="you" {...animationProps}>
            <AvatarFromInfo info={currentUser.info as any as AvatarInfo} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const AvatarFromInfo = ({ info }: { info: AvatarInfo }) => {
  console.log({ info });
  const { color, name, picture } = info as any as AvatarInfo;
  return (
    <Avatar {...avatarProps} picture={picture} name={name} color={color} />
  );
};
