import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { GetServerSideProps } from "next";
import { Canvas } from "../../components/Room/Canvas";
import { LiveAvatars } from "../../components/Room/LiveAvatars";
import { RoomProvider } from "../../liveblocks.config";
import { Layer } from "../../shared/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: { id: context.query.id } };
};

export default function RoomPage({ id }: { id: string }) {
  return (
    <>
      <RoomProvider
        id={id}
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
        <ClientSideSuspense fallback={<Loading />}>
          {() => (
            <div className="grid grid-cols-2 gap-2 flex justify-center items-center max-w-md">
              <LiveAvatars />
              <Canvas />
            </div>
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </>
  );
}

function Loading() {
  return (
    <div className="absolute w-screen h-screen flex place-content-center place-items-center bg-slate-50">
      <img
        className="w-16 h-16 opacity-20"
        src="https://liveblocks.io/loading.svg"
        alt="Loading"
      />
    </div>
  );
}
