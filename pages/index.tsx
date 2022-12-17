import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import logoPic from "../public/images/logo.png";
import { Room } from "../shared/types";

import AvatarSelection, {
  generateRandomAvatarUrl,
} from "../components/AvatarSelection";
import Modal from "../components/Modal";
import { UserInfoCookie } from "../shared/types";

const Landing = ({ rooms }: { rooms: Room[] }) => {
  const userInfoCookie = JSON.parse(
    getCookie("user")?.toString() ?? "{}"
  ) as UserInfoCookie;

  const [avatarUrl, setAvatarUrl] = useState<string>(
    userInfoCookie?.avatarUrl ?? generateRandomAvatarUrl()
  );
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [showRoomCreation, setShowRoomCreation] = useState(false);
  const [username, setUsername] = useState<string>(
    userInfoCookie?.username ?? ""
  );
  const router = useRouter();

  const play = () => {
    const userInfoCookie: UserInfoCookie = {
      avatarUrl,
      username,
    };
    setCookie("user", userInfoCookie);
    router.push(`room/${selectedRoom}`);
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
                      {r.id}
                    </div>
                  ))}
                </div>
                <button
                  className="mt-4 w-full py-5 rounded-md shadow-lg bg-gradient-to-r from-slate-800 to-slate-900 font-medium text-gray-100 block transition duration-300 text-2xl disabled:opacity-25"
                  disabled={!!!username || !!!selectedRoom}
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
        title="Labas"
        active={showRoomCreation}
        onClose={() => setShowRoomCreation(false)}
      >
        Labas vakaras
      </Modal>
    </>
  );
};

export default Landing;

export async function getServerSideProps() {
  const res = await fetch(`https://api.liveblocks.io/v2/rooms`, {
    headers: new Headers({
      Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
    }),
  });
  const rooms = await res.json();

  return { props: { rooms: rooms.data } };
}
