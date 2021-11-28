import { PublicKey } from "@solana/web3.js";

import * as fs from "fs";

export const logError = (msg: string) => {
  console.log(`\x1b[31m${msg}\x1b[0m`);
};

export const getPublicKey = (name: string) => {
  return new PublicKey(
    JSON.parse(fs.readFileSync(`keys/${name}_pub.json`) as unknown as string)
  );
};

export const getPrivateKey = (name: string) =>
  Uint8Array.from(
    JSON.parse(fs.readFileSync(`./keys/${name}.json`) as unknown as string)
  );

export const getProgramId = (name: string) => {
  try {
    return getPublicKey(name);
  } catch (e) {
    logError("Given programId is missing or incorrect");
    process.exit(1);
  }
};
