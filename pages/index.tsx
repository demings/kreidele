import { getCookie, setCookie } from "cookies-next";
import absoluteUrl from "next-absolute-url";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import logoPic from "../public/images/logo.png";
import { Room } from "../shared/types";

import { GetServerSideProps } from "next";
import AvatarSelection, {
  generateRandomAvatarUrl,
} from "../components/AvatarSelection";
import Modal from "../components/Modal";
import { UserInfoCookie } from "../shared/types";

const Landing = ({
  rooms,
  avatarUrlFromCookie,
  usernameFromCookie,
}: {
  rooms: Room[];
  usernameFromCookie?: string;
  avatarUrlFromCookie?: string;
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(
    avatarUrlFromCookie ?? generateRandomAvatarUrl()
  );
  const [selectedRoom, setSelectedRoom] = useState<string>();
  const [showRoomCreation, setShowRoomCreation] = useState(false);
  const [username, setUsername] = useState<string>(usernameFromCookie ?? "");
  const [showError, setShowError] = useState(false);

  const [roomCreationConfiguration, setRoomCreationConfiguration] = useState({
    name: "",
    private: false,
  });
  const router = useRouter();

  const setUserCookies = () => {
    const userInfoCookie: UserInfoCookie = {
      avatarUrl,
      username,
    };
    setCookie("user", userInfoCookie);
  };

  const play = () => {
    setUserCookies();
    router.push(`room/${selectedRoom}`);
  };

  const createRoom = async () => {
    setUserCookies();
    const data = {
      name: roomCreationConfiguration.name,
      private: roomCreationConfiguration.private,
    };
    const response = await fetch("/api/room/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const responseAnswer = await response.json();
    if (!responseAnswer.success) {
      setShowError(true);
    } else {
      setShowError(false);
      router.push(`room/${responseAnswer.success.id}`);
    }

    // return response.json();
    // router.push(`room/${removeAccents(roomCreationConfiguration.name)}`);
  };

  return (
    <>
      <div
        id="login"
        className="p-4 pt-0 flex flex-col justify-center min-h-screen max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center mb-8">
          <Image
            className="justify-center"
            src={logoPic}
            alt="Žaidimas KREIDELĖ - piešk ir spėliok žodžius kartu su draugų kompanija!"
            width={484}
            height={113}
          />
        </div>
        <div className="max-h-96 grid grid-cols-2 grid-rows-5 gap-4 p-6 bg-slate-200 rounded">
          <input
            className=" block h-11 p-2 w-full border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-400"
            type="text"
            name="username"
            placeholder="Vardas"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <div className="row-span-4 overflow-y-scroll rounded-lg">
            {rooms.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  setSelectedRoom(r.id);
                }}
                className={`w-full bg-slate-50 p-2 border rounded-md  ${
                  selectedRoom === r.id ? "bg-slate-500 text-white" : ""
                }`}
                id={r.id}
              >
                {r.metadata.name || r.id}
              </div>
            ))}
          </div>
          <div className="row-span-3">
            <AvatarSelection
              setAvatarUrl={setAvatarUrl}
              avatarUrl={avatarUrl}
            />
          </div>
          <button
            className="w-full rounded-md shadow-lg bg-gradient-to-r from-slate-600 to-slate-700 font-medium text-gray-100 block transition duration-300 text-xl disabled:opacity-25"
            data-modal-toggle="createRoom"
            disabled={!username}
            onClick={() => {
              setShowRoomCreation(true);
            }}
          >
            SUKURTI KAMBARĮ
          </button>
          <button
            className="w-full rounded-md shadow-lg bg-gradient-to-r from-slate-800 to-slate-900 font-medium text-gray-100 block transition duration-300 text-xl disabled:opacity-25"
            disabled={!username || !selectedRoom}
            onClick={() => {
              play();
            }}
          >
            ŽAISTI
          </button>
        </div>
      </div>
      <Modal
        title="Naujo kambario kūrimas"
        active={showRoomCreation}
        onClose={() => setShowRoomCreation(false)}
      >
        <div className="w-full">
          <input
            className="mb-3 px-2 py-1.5 mt-1 block w-full border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-400"
            type="text"
            name="newRoomName"
            placeholder="Pavadinimas"
            onChange={(e) =>
              setRoomCreationConfiguration({
                name: e.target.value,
                private: roomCreationConfiguration.private,
              })
            }
            value={roomCreationConfiguration.name}
          />
        </div>
        <div className="w-full mb-3">
          <label className="inline-flex relative items-center cursor-pointer">
            <span className="mr-3 text-sm font-medium text-gray-900">
              Privatus
            </span>
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              onChange={(e) => {
                setRoomCreationConfiguration({
                  ...roomCreationConfiguration,
                  private: !!e.target.checked,
                });
              }}
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-slate-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[68px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-500"></div>
          </label>
        </div>
        <div className="w-full">
          <div
            className={`bg-red-100 border border-red-400 text-red-700 px-4 rounded relative mb-2 ${
              showError ? "" : "hidden"
            }`}
            role="alert"
          >
            <span className="block text-md">
              Toks kambario vardas jau užimtas
            </span>
            <span className="absolute top-0 bottom-0 right-0 px-4"></span>
          </div>
          <button
            className={`w-full py-3 rounded-md shadow-lg bg-gradient-to-r from-slate-600 to-slate-700 font-medium text-gray-100 block transition duration-300 text-xl disabled:opacity-25 ${
              showError ? " from-red-600 to-red-800" : ""
            }`}
            data-modal-toggle="createRoom"
            disabled={!username}
            onClick={() => {
              createRoom();
            }}
          >
            SUKURTI
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Landing;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { origin } = absoluteUrl(req);
  const result = await fetch(`${origin}/api/room`);
  const rooms = await result.json();

  const userInfoCookie = JSON.parse(
    getCookie("user", { req, res })?.toString() ?? "{}"
  ) as UserInfoCookie;

  console.log({ userInfoCookie });

  return {
    props: {
      rooms: rooms.success,
      avatarUrlFromCookie: userInfoCookie?.avatarUrl,
      usernameFromCookie: userInfoCookie?.username,
    },
  };
};
