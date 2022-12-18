import Cors from "cors";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import { Room } from "../../shared/types";

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});
const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;
const HEADER = new Headers({
  Authorization: `Bearer ${API_KEY}`,
});

const externalURL = "https://api.liveblocks.io/v2/rooms";

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
    let found = false;
    roomsList.data.forEach((room: Room) => {
      if (room.metadata.name === request.name && request.private === false) {
        found = true;
        return;
      }
    });
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
      },
    };
    const response = await fetch(externalURL, {
      method: "POST",
      mode: "cors",
      headers: HEADER,
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    const answer = await response.json();
    return res.status(200).json({ success: answer });
  } else if (req.method === "GET") {
    const answer = await getRooms();
    let publicRooms = answer.data.filter((el: Room) => {
      return el.metadata.private === "false";
    });
    res.status(200).json({ success: publicRooms });
  } else {
    res.status(200).json({ message: "This method is not implemented" });
  }
}

async function getRooms() {
  const response = await fetch(externalURL, {
    headers: HEADER,
  });
  const answer = await response.json();
  return answer;
}
