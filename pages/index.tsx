import { PencilIcon } from "@heroicons/react/24/solid";

const Landing = () => {
  return (
    <>
      <div className="bg-gradient-to-tr from-slate-800 to-sky-500">
        <section
          id="login"
          className="p-4 flex flex-col justify-center min-h-screen max-w-md mx-auto"
        >
          <div className="p-6 bg-slate-200 rounded">
            <div className="flex items-center justify-center font-black m-2 mb-6">
              <PencilIcon className="w-8 mr-2 fill-slate-900	"></PencilIcon>
              <h1 className="tracking-wide text-3xl text-slate-900">
                Kreidelė
              </h1>
            </div>
            <form
              id="login_form"
              action="room/1234"
              method="POST"
              className="flex flex-col justify-center"
            >
              <label className="text-sm font-medium">Vartotojo vardas</label>
              <input
                className="mb-3 px-2 py-1.5
                  mb-3 mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-400"
                type="text"
                name="username"
                placeholder="Vartotojo vardas"
              />
              <label className="text-sm font-medium">Kambarys</label>
              <select
                className="
          mb-3 mt-1 block w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-400"
                name="messages"
                placeholder="Write something"
              >
                <option value="random">Numatytasis</option>
              </select>
              <button
                className="px-4 py-1.5 rounded-md shadow-lg bg-gradient-to-r from-slate-700 to-slate-900 font-medium text-gray-100 block transition duration-300"
                type="submit"
              >
                <span id="login_process_state" className="hidden">
                  Sending :)
                </span>
                <span id="login_default_state">
                  ŽAISTI<span id="subtotal"></span>
                </span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default Landing;
