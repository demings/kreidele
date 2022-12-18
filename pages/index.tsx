import { getCookie, setCookie } from "cookies-next";
import absoluteUrl from "next-absolute-url";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import logoPic from "../public/images/logo.png";
import { Room } from "../shared/types";

import AvatarSelection, {
  generateRandomAvatarUrl,
} from "../components/AvatarSelection";
import Modal from "../components/Modal";
import { UserInfoCookie } from "../shared/types";

const Landing = ({ rooms }: { rooms: Room[] }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(generateRandomAvatarUrl());
  const [selectedRoom, setSelectedRoom] = useState<string>();
  const [showRoomCreation, setShowRoomCreation] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const userInfoCookie = JSON.parse(
      getCookie("user")?.toString() ?? "{}"
    ) as UserInfoCookie;
    setAvatarUrl(userInfoCookie.avatarUrl);
    setUsername(userInfoCookie.username);
  }, []);

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
      <div className="bg-gradient-to-tr from-slate-600 to-sky-300">
        <section
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
          <div className="p-6 bg-slate-200 rounded">
            <div className="flex items-center justify-center font-black m-2 mb-2"></div>
            <div className="grid grid-cols-2">
              <div className="p-2">
                <label className="text-sm font-medium">Vartotojo vardas</label>
                <input
                  className="mb-3 px-2 py-1.5
                  mb-3 mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-400"
                  type="text"
                  name="username"
                  placeholder="Vartotojo vardas"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
                <label className="text-sm font-medium">
                  Vartotojo nuotrauka
                </label>
                <AvatarSelection
                  setAvatarUrl={setAvatarUrl}
                  avatarUrl={avatarUrl}
                />
                <button
                  className="mt-4 w-full py-5 rounded-md shadow-lg bg-gradient-to-r from-slate-600 to-slate-700 font-medium text-gray-100 block transition duration-300 text-2xl disabled:opacity-25"
                  data-modal-toggle="createRoom"
                  disabled={!username}
                  onClick={() => {
                    setShowRoomCreation(true);
                  }}
                >
                  SUKURTI KAMBARĮ
                </button>
              </div>
              <div className="p-2">
                <label className="text-sm font-medium">
                  Pasirinkti kambarį
                </label>
                <div className="bg-white mt-2 overflow-y-scroll	h-52 rounded-lg">
                  {rooms.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedRoom(r.id);
                      }}
                      className={`w-full bg-slate-300 p-2 border rounded-md  ${
                        selectedRoom === r.id
                          ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white"
                          : ""
                      }`}
                      id={r.id}
                    >
                      {r.metadata.name || r.id}
                    </div>
                  ))}
                </div>
                <button
                  className="mt-4 w-full py-5 rounded-md shadow-lg bg-gradient-to-r from-slate-800 to-slate-900 font-medium text-gray-100 block transition duration-300 text-2xl disabled:opacity-25"
                  disabled={!username || !selectedRoom}
                  onClick={() => {
                    play();
                  }}
                >
                  ŽAISTI
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Modal
        title="Naujo kambario sukūrimas"
        active={showRoomCreation}
        onClose={() => setShowRoomCreation(false)}
      >
        <div className="w-full">
          <label className="text-sm font-medium">Naujo kambario vardas</label>
          <input
            className="mb-3 px-2 py-1.5
                  mb-3 mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-400"
            type="text"
            name="newRoomName"
            placeholder="Naujo kambario vardas"
            onChange={(e) =>
              setRoomCreationConfiguration({
                name: e.target.value,
                private: roomCreationConfiguration.private,
              })
            }
            value={roomCreationConfiguration.name}
          />
        </div>
        <div className="w-full mb-2">
          <label className="inline-flex relative items-center cursor-pointer">
            <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
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
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[68px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
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
            className={`w-full py-5 rounded-md shadow-lg bg-gradient-to-r from-slate-600 to-slate-700 font-medium text-gray-100 block transition duration-300 text-2xl disabled:opacity-25 ${
              showError ? " from-red-600 to-red-800" : ""
            }`}
            data-modal-toggle="createRoom"
            disabled={!username}
            onClick={() => {
              createRoom();
            }}
          >
            SUKURTI KAMBARĮ
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Landing;

export async function getServerSideProps({ req }) {
  const { origin } = absoluteUrl(req);
  const res = await fetch(`${origin}/api/room`);
  const rooms = await res.json();
  return { props: { rooms: rooms.success.data } };
}
