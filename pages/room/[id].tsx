import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { GetServerSideProps } from "next";
import { RoomProvider } from "../../liveblocks.config";
import { Layer } from "../../shared/types";
import { Canvas } from "../../src/components/Room/Canvas";

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
          {() => <Canvas />}
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
