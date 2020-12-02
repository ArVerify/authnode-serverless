import { NowRequest, NowResponse } from '@vercel/node';
import pkg from "../package.json";

export default function (req: NowRequest, res: NowResponse) {
  res.send({
    status: "alive",
    version: pkg.version
  });
}