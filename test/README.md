# Testing Scripts for Rubix Cubers

## Prerequisite

1. Create `.env` from `.env.sample`
2. Set `METADATA_URI`
3. Set `CONNECTION_URI` for devnet

## Install Node Packages

1. Go to `./test` dir
2. Run `npm install`

## Config for Testing

1. Update `creator.json` & `bidder.json` with the private keys you get from sollet.io
2. Update `program_pub.json` with the program Id you get during the deployment of solana program
3. Update `metadata_program_pub.json` with the already deployed metaplex's program id `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`

## Run Testing Scripts

Run `npm run start`
