import { NowRequest, NowResponse } from '@vercel/node';

export default function (req: NowRequest, res: NowResponse) {
  res.send({
    status: "alive",
    version: process.env.npm_package_version
  });
}