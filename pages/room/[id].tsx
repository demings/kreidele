import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { GetServerSideProps } from "next";
import { Canvas } from "../../components/Room/Canvas/Canvas";
import { LiveAvatars } from "../../components/Room/LiveAvatars";
import { RoomProvider } from "../../liveblocks.config";
import { Layer } from "../../shared/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: { id: context.query.id } };
};

export default function RoomPage({ id }: { id: string }) {
  return (
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
          <div className="grid h-screen place-items-center">
            <div className="shadow-md grid grid-rows-flow">
              <div className="bg-white rounded-t-md border-b-[1px]">
                <LiveAvatars />
              </div>
              <Canvas />
              <input
                className="shadow-sm rounded-b-md border w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="guess"
                type="text"
                placeholder="Atspėk žodį..."
              />
            </div>
          </div>
        )}
      </ClientSideSuspense>
    </RoomProvider>
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
