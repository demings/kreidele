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
  drawerId,
}: {
  currentUser: UserMeta;
  others: UsersMapped;
  drawerId?: string;
}) {
  return (
    <div className="m-2 min-h-min flex pl-2 overflow-hidden">
      <AnimatePresence>
        {others.map(([key, user]) => {
          return (
            <motion.div key={key} {...animationProps}>
              <AvatarFromUser
                user={user}
                drawing={user.avatarUrl === drawerId}
              />
            </motion.div>
          );
        })}

        {currentUser ? (
          <motion.div key="you" {...animationProps}>
            <AvatarFromUser
              user={currentUser}
              drawing={currentUser.avatarUrl === drawerId}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const AvatarFromUser = ({
  user,
  drawing,
}: {
  user: UserMeta;
  drawing: boolean;
}) => {
  return (
    <Avatar
      {...avatarProps}
      username={user.username}
      avatarUrl={user.avatarUrl}
      drawing={drawing}
    />
  );
};
