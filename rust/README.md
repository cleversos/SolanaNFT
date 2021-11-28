# NFT Solana Program for Rubix Cubers

We're using [metaplex](https://metaplex.com/)'s token-metadata program for our NFT

## Prerequisite

1. Install [Rust & Cargo](https://www.rust-lang.org/tools/install)
2. Install [Solana Cli](https://docs.solana.com/cli/install-solana-cli-tools)
3. Create [Solana Accounts](https://www.sollet.io/) for creator & bidder

The private keys of creator & bidder will be used on testing scripts.

## Build Solana Program

1. Go to `./rust` dir
2. Build program `cargo build-bpf`

## Config for Deployment

We're using `devnet` for testing so we need to setup config properly using `solana` cli.

To set `devnet` for playground, need to run the following command.

`solana config set --url=devnet`

You can confirm the exact settings using `solana config get`
RPC URL should be `https://api.devnet.solana.com`

You need to create an account to deploy program on `devnet` if you didn't create an account before.
`solana-keygen new`

We're ready to go to the next step now.

## Deploy Program on `devnet`

1. Go to `./rust/target/deploy`
2. Run `solana program deploy solana_anchor.so`

Once you complete to deploy the program, cli will show you Program ID of our program. You should use that id on testing scripts.
