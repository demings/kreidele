import { authorize } from "@liveblocks/node";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { UserInfoCookie } from "../../shared/types";

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  if (!API_KEY) {
    return res.status(403).end();
  }

  const room = req.body.room;

  const userInfoCookie = JSON.parse(
    getCookie("user", { req, res })?.toString() ?? "{}"
  ) as UserInfoCookie;

  const response = await authorize({
    room,
    secret: API_KEY,
    userInfo: {
      username: userInfoCookie.username,
      avatarUrl: userInfoCookie.avatarUrl,
    },
  });

  return res.status(response.status).end(response.body);
}
