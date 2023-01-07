import Cors from "cors";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import { liveblocksApiKey, liveblocksUrl } from "../../../shared/constants";
import { Room } from "../../../shared/types";

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

const headers = new Headers({
  Authorization: `Bearer ${liveblocksApiKey}`,
});

const externalURL = `${liveblocksUrl}/rooms`;

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    const request = JSON.parse(req.body);

    const roomsList = await getRooms();

    // await deleteRooms(roomsList.data.map((room: Room) => room.id));

    const found = roomsList.data.some(
      (room: Room) =>
        room.metadata.name == request.name && request.private == false
    );

    if (found) {
      return res
        .status(406)
        .json({ success: false, message: "room already exists" });
    }

    const data = {
      id: nanoid(),
      defaultAccesses: ["room:write"],
      metadata: {
        name: request.name,
        private: request.private.toString(),
        hostId: request.hostId,
      },
    };

    const response = await fetch(externalURL, {
      method: "POST",
      mode: "cors",
      headers,
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });

    return res.status(200).json({ success: await response.json() });
  }

  if (req.method === "GET") {
    const publicRooms = (await getRooms()).data.filter(
      (room: Room) => room.metadata.private === "false"
    );

    res.status(200).json({ success: publicRooms });
  } else {
    res.status(200).json({ message: "This method is not implemented" });
  }
}

async function getRooms() {
  return (
    await fetch(externalURL, {
      method: "GET",
      headers,
    })
  ).json();
}

// async function deleteRooms(ids: string[]) {
//   ids.forEach(async (id) => {
//     const result = await fetch(externalURL + "/" + id, {
//       method: "DELETE",
//       headers,
//     });
//     console.log(await result.json());
//   });
// }
