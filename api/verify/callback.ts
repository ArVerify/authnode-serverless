import { NowRequest, NowResponse } from '@vercel/node';
import Arweave from "arweave";
import { JWKInterface } from 'arweave/node/lib/wallet';
import { google } from "googleapis";

export default async function (req: NowRequest, res: NowResponse) {
  const code: string | string[] = req.query.code;
  const state: string | string[] = req.query.state;
  // @ts-expect-error
  const address: string | string[] = JSON.parse(state).address;
  // @ts-expect-error
  const returnURI: string | string[] = JSON.parse(state).returnUri;
  const jwk: JWKInterface = JSON.parse(process.env.jwk);

  const client: Arweave = new Arweave({
    host: "arweave.net",
    port: 443,
    protocol: "https"
  });

  const oauthClient = new google.auth.OAuth2(
    process.env.gClientID,
    process.env.gClientSecret,
    process.env.endpoint + (process.env.endpoint.endsWith("/") ? "" : "/") + "verify/callback"
  );

  // @ts-expect-error
  const response = await oauthClient.getToken(code);
  if (response.tokens.access_token) {
    const info = await oauthClient.getTokenInfo(response.tokens.access_token);

    if (info.email_verified) {
      const tags = {
        "App-Name": "ArVerify",
        Type: "Verification",
        Method: "Google",
        Address: address
      };

      const transaction = await client.createTransaction({
        // @ts-expect-error
        target: address,
        data: Math.random().toString().slice(-4)
      }, jwk);
      for (const [key, value] of Object.entries(tags)) {
        // @ts-expect-error
        transaction.addTag(key, value);
      }

      await client.transactions.sign(transaction, jwk);
      await client.transactions.post(transaction);

      res.send({
        status: "success",
        id: transaction.id
      });
    }
  }

  // @ts-expect-error
  if (returnURI) res.redirect(returnURI);
}