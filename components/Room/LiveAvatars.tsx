import { AnimatePresence, motion } from "framer-motion";
import { UserMeta, UsersMapped } from "../../liveblocks.config";
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

export function LiveAvatars({
  currentUser,
  others,
}: {
  currentUser: UserMeta;
  others: UsersMapped;
}) {
  return (
    <div
      style={{
        minHeight: avatarProps.size + "px",
        display: "flex",
        paddingLeft: "0.75rem",
        overflow: "hidden",
      }}
      className="m-2"
    >
      <AnimatePresence>
        {others.map(([key, info]) => {
          return (
            <motion.div key={key} {...animationProps}>
              <AvatarFromInfo info={info} />
            </motion.div>
          );
        })}

        {currentUser ? (
          <motion.div key="you" {...animationProps}>
            <AvatarFromInfo info={currentUser} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const AvatarFromInfo = ({ info }: { info: UserMeta }) => {
  const { username, avatarUrl } = info;
  return <Avatar {...avatarProps} username={username} avatarUrl={avatarUrl} />;
};
