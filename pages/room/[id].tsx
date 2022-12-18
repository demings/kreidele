import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { GetServerSideProps } from "next";
import { Canvas } from "../../components/Room/Canvas/Canvas";
import { ChatHistory } from "../../components/Room/ChatHistory";
import { GuessInput } from "../../components/Room/GuessInput";
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
          <div className="flex justify-center">
            <div className="grid h-screen place-items-center">
              <div className="w-96 shadow-md grid grid-rows-flow grid-cols-1">
                <div className="col-span-2 rounded-t-md bg-slate-50">
                  <ChatHistory />
                </div>
                <div className="bg-white  border-b">
                  <LiveAvatars />
                </div>
                <Canvas />
                <div className="border-t">
                  <GuessInput />
                </div>
              </div>
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
