import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";
import AvatarSelection, {
  generateRandomAvatarUrl,
} from "../src/components/AvatarSelection";

const Landing = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>(generateRandomAvatarUrl());
  const [room, setRoom] = useState<number>(1234);
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  const play = () => {
    setCookie("avatar", avatarUrl);
    setCookie("room", room);
    setCookie("username", username);
    router.push(`room/${room}`);
  };

  return (
    <>
      <div className="bg-gradient-to-tr from-slate-800 to-sky-500">
        <section
          id="login"
          className="p-4 flex flex-col justify-center min-h-screen max-w-md mx-auto"
        >
          <div className="p-6 bg-slate-200 rounded">
            <div className="flex items-center justify-center font-black m-2 mb-6">
              <h1 className="tracking-wide text-3xl text-slate-900">
                Kreidelė
              </h1>
            </div>
            <label className="text-sm font-medium">Vartotojo vardas</label>
            <input
              className="mb-3 px-2 py-1.5
                  mb-3 mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-400"
              type="text"
              name="username"
              placeholder="Vartotojo vardas"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="text-sm font-medium">Vartotojo nuotrauka</label>
            <AvatarSelection
              setAvatarUrl={setAvatarUrl}
              avatarUrl={avatarUrl}
            />
            <label className="text-sm font-medium">Kambarys</label>
            <select
              className="
          mb-3 mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-400"
              name="messages"
              placeholder="Write something"
              onChange={(e) => setRoom(parseInt(e.target.value))}
            >
              <option value="1234">Babaužiukai</option>
              <option value="1235">Daiktai</option>
            </select>
            <button
              className="m-auto w-full py-5 rounded-md shadow-lg bg-gradient-to-r from-slate-700 to-slate-900 font-medium text-gray-100 block transition duration-300 text-2xl disabled:opacity-25"
              disabled={!!!username}
              onClick={() => {
                play();
              }}
            >
              ŽAISTI
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Landing;
