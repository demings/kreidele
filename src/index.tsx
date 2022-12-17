import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "../liveblocks.config";
import { Canvas } from "./components/Room/Canvas";
import styles from "./index.module.css";
import { Layer } from "./types";

export default function Whiteboard({ roomId }: { roomId: string }) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        selection: [],
        cursor: null,
        pencilDraft: null,
        penColor: null,
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList(),
      }}
    >
      <div className={styles.container}>
        <ClientSideSuspense fallback={<Loading />}>
          {() => <Canvas />}
        </ClientSideSuspense>
      </div>
    </RoomProvider>
  );
}

function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.loading}>
        <img src="https://liveblocks.io/loading.svg" alt="Loading" />
      </div>
    </div>
  );
}
