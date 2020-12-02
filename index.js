import { sendGenesis } from "arverify";

const jwk = JSON.parse(process.env.JWK);
const endpoint = process.env.ENDPOINT;

async function start() {
  const genesisTransaction = await sendGenesis(jwk, endpoint);

  if (genesisTransaction === "stake") {
    console.error("You're missing ArVerify Stake. You must have some before deploying an AuthNode.");
    process.exit(1);
  } else {
    console.log(`Successfully sent genesis transaction with id: ${genesisTransaction}`);
    console.log("Your Serverless AuthNode is coming online now...");
  }
}

start();