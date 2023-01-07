import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import { liveblocksApiKey, liveblocksUrl } from "../../../shared/constants";

const cors = Cors({
  methods: ["DELETE"],
});

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

  if (req.method === "DELETE") {
    const result = await fetch(`${liveblocksUrl}/rooms/${req.query.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${liveblocksApiKey}`,
      },
    });
    console.log(await result.json());

    return res.status(200);
  }

  return res.status(200).json({ message: "This method is not implemented" });
}

async function deleteRoom(id: string[]) {}
