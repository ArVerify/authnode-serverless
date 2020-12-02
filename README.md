# Serverless ArVerify Node

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ft8%2Fauthnode-serverless)

A serverless way to deploy an Authentication Node on the [ArVerify Network](https://arverify.org/).

## Configuration

All configuration is done via environment variables. Refer to the following table to properly configure your node.

| Variable | Example | Description |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | ... | The Google Authentication Client ID |
| `GOOGLE_CLIENT_SECRET` | ... | The Google Authentication Client Secret |
| `ENDPOINT` | https://authnode.tateberenbaum.com | The endpoint where your AuthNode is hosted |
| `JWK` | {...} | Your Arweave Keyfile |