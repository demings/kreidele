import { AnimatePresence, motion } from "framer-motion";
import { useOthersMapped, useSelf } from "../../liveblocks.config";
import { UserInfoCookie } from "../../shared/types";
import { Avatar } from "./Avatar";

/**
 * This file shows how to add live avatars like you can see them at the top right of a Google Doc or a Figma file.
 *
 * The users picture and name are not set via the `useMyPresence` hook like the cursors.
 * They are set from the authentication endpoint.
 *
 * See pages/api/auth.ts and https://liveblocks.io/docs/api-reference/liveblocks-node#authorize for more information
 */

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
};

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
        {others.map(([key, info]) => {
          return (
            <motion.div key={key} {...animationProps}>
              <AvatarFromInfo info={info as any as UserInfoCookie} />
            </motion.div>
          );
        })}

        {currentUser ? (
          <motion.div key="you" {...animationProps}>
            <AvatarFromInfo info={currentUser.info as any as UserInfoCookie} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const AvatarFromInfo = ({ info }: { info: UserInfoCookie }) => {
  const { username, avatarUrl } = info;
  return <Avatar {...avatarProps} username={username} avatarUrl={avatarUrl} />;
};
