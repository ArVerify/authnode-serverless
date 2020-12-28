import { NowRequest, NowResponse } from '@vercel/node';
import Arweave from "arweave";
import { JWKInterface } from 'arweave/node/lib/wallet';
import { google } from "googleapis";
import { isVerified, tipReceived } from "arverify";

export default async function (req: NowRequest, res: NowResponse) {
  const address: string | string[] = req.query.address;
  const returnURI: string | string[] = req.query.return;
  const jwk: JWKInterface = JSON.parse(process.env.JWK);

  const client: Arweave = new Arweave({
    host: "arweave.net",
    port: 443,
    protocol: "https"
  });

  const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.ENDPOINT + (process.env.ENDPOINT.endsWith("/") ? "" : "/") + "verify/callback"
  );

  // Check if address was passed in
  if (!address) {
    res.statusCode = 400;
    res.send({
      status: "error",
      message: "address is reqired"
    });
    return;
  }

  // Check if the address is verified
  // @ts-expect-error
  if ((await isVerified(address)).verified) {
    res.send({
      status: "success",
      message: "already verified",
    });
    return;
  }

  // Check if a tip has been received
  // @ts-expect-error
  if (!(await tipReceived(address, await client.wallets.jwkToAddress(jwk)))) {
    res.statusCode = 400;
    res.send({
      status: "error",
      message: "no tip"
    });
    return;
  }

  // Return an authentication uri
  const uri: string = oauthClient.generateAuthUrl({
    scope: ["openid", "email", "profile"],
    state: JSON.stringify({
      address,
      returnUri: returnURI
    })
  });

  res.send({
    status: "success",
    uri
  });
}