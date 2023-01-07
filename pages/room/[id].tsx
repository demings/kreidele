import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { GetServerSideProps } from "next";
import { Room } from "../../components/Room/Room";
import { RoomProvider } from "../../liveblocks.config";
import { liveblocksApiKey, liveblocksUrl } from "../../shared/constants";
import { Layer } from "../../shared/types";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const response = await fetch(`${liveblocksUrl}/rooms/${query.id}`, {
    headers: {
      Authorization: `Bearer ${liveblocksApiKey}`,
    },
  });

  const result = await response.json();

  return { props: { id: query.id, hostId: result.metadata.hostId } };
};

export default function RoomPage({
  id,
  hostId,
}: {
  id: string;
  hostId: string;
}) {
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
        {() => <Room hostId={hostId} />}
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
