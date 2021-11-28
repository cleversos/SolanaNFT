import {
  Connection,
  Keypair,
  Signer,
  PublicKey,
  Transaction,
  TransactionSignature,
  ConfirmOptions,
  sendAndConfirmRawTransaction,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
  Commitment,
  LAMPORTS_PER_SOL,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import fs from "fs";
import * as anchor from "@project-serum/anchor";

import { getProgramId } from "./utils";

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export let programId = getProgramId("program");
let metadataProgramId = getProgramId("metadata_program");
const idl = JSON.parse(fs.readFileSync("src/solana_anchor.json", "utf8"));

export async function initPool(
  conn: Connection,
  owner: Keypair,
  pool: Keypair,
  sale_mint: PublicKey
) {
  console.log("+ initPool");
  let wallet = new anchor.Wallet(owner);
  let provider = new anchor.Provider(
    conn,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  try {
    await program.rpc.initPool({
      accounts: {
        pool: pool.publicKey,
        owner: owner.publicKey,
        saleMint: sale_mint,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [owner, pool],
    });
  } catch (err) {
    console.log(err);
  }
  console.log("- end");
  await sleep(100);
  // const account = await program.account.pool.fetch(pool.publicKey)
  // console.log(account)
}

export async function setWhitelist(
  conn: Connection,
  pool: PublicKey,
  owner: Keypair,
  bidder: PublicKey,
  amount: number,
  whitelisted: Boolean
) {
  console.log("+ setWhitelist");
  let wallet = new anchor.Wallet(owner);
  let provider = new anchor.Provider(
    conn,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  let [client, bump] = await PublicKey.findProgramAddress(
    [programId.toBuffer(), pool.toBuffer(), bidder.toBuffer()],
    programId
  );

  try {
    await program.rpc.setWhitelist(
      new anchor.BN(bump),
      new anchor.BN(amount),
      whitelisted,
      {
        accounts: {
          client: client,
          pool: pool,
          owner: owner.publicKey,
          bidder: bidder,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [owner],
      }
    );
  } catch (err) {
    console.log(err);
  }
  console.log("- end");
  await sleep(100);
  // const account = await program.account.client.fetch(client)
  // console.log(account)
}

export async function updateWhitelist(
  conn: Connection,
  pool: PublicKey,
  owner: Keypair,
  bidder: PublicKey,
  amount: number,
  whitelisted: Boolean
) {
  console.log("+ updateWhitelist");
  let wallet = new anchor.Wallet(owner);
  let provider = new anchor.Provider(
    conn,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  let [client, bump] = await PublicKey.findProgramAddress(
    [programId.toBuffer(), pool.toBuffer(), bidder.toBuffer()],
    programId
  );

  try {
    await program.rpc.updateWhitelist(new anchor.BN(amount), whitelisted, {
      accounts: {
        client: client,
        pool: pool,
        owner: owner.publicKey,
      },
      signers: [owner],
    });
  } catch (err) {
    console.log(err);
  }
  console.log("- end");
  await sleep(100);
  // const account = await program.account.client.fetch(client)
  // console.log(account)
}

export async function controlPresaleLive(
  conn: Connection,
  pool: PublicKey,
  owner: Keypair,
  isLive: Boolean
) {
  console.log("+ controlPresaleLive");
  let wallet = new anchor.Wallet(owner);
  let provider = new anchor.Provider(
    conn,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);

  try {
    await program.rpc.controlPresaleLive(isLive, {
      accounts: {
        pool: pool,
        owner: owner.publicKey,
      },
      signers: [owner],
    });
  } catch (err) {
    console.log(err);
  }
  console.log("- end");
  await sleep(100);
  // const account = await program.account.pool.fetch(pool)
  // console.log(account)
}

export async function mintNft(
  conn: Connection,
  owner: Keypair,
  pool: PublicKey,
  mint: PublicKey,
  token_account: PublicKey,
  data: any
) {
  console.log("+ mintNFT");
  let wallet = new anchor.Wallet(owner);
  let provider = new anchor.Provider(
    conn,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  let client = (
    await PublicKey.findProgramAddress(
      [programId.toBuffer(), pool.toBuffer(), owner.publicKey.toBuffer()],
      programId
    )
  )[0];
  let metadata = (
    await PublicKey.findProgramAddress(
      [Buffer.from("metadata"), metadataProgramId.toBuffer(), mint.toBuffer()],
      metadataProgramId
    )
  )[0];
  let master_endition = (
    await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        metadataProgramId.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      metadataProgramId
    )
  )[0];
  let [metadata_extended, bump] = await PublicKey.findProgramAddress(
    [mint.toBuffer(), pool.toBuffer(), programId.toBuffer()],
    programId
  );
  try {
    await program.rpc.mintNft(new anchor.BN(bump), data, {
      accounts: {
        owner: owner.publicKey,
        pool: pool,
        client: client,
        mint: mint,
        tokenAccount: token_account,
        metadata: metadata,
        masterEdition: master_endition,
        metadataExtended: metadata_extended,
        tokenMetadataProgram: metadataProgramId,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
      signers: [owner],
    });
  } catch (err) {
    console.log(err);
  }
  console.log("- end");
  await sleep(1000);
  // const account = await program.account.metadataExtended.fetch(metadata_extended)
  // console.log(account)
}

export async function setMaxPrice(
  conn: Connection,
  owner: Keypair,
  pool: PublicKey,
  mint: PublicKey,
  max_price: number
) {
  console.log("+ setMaxPrice");
  let wallet = new anchor.Wallet(owner);
  let provider = new anchor.Provider(
    conn,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  let metadata_extended = (
    await PublicKey.findProgramAddress(
      [mint.toBuffer(), pool.toBuffer(), programId.toBuffer()],
      programId
    )
  )[0];
  try {
    await program.rpc.setMaxPrice(new anchor.BN(max_price), {
      accounts: {
        owner: owner.publicKey,
        pool: pool,
        mint: mint,
        metadataExtended: metadata_extended,
      },
      signers: [owner],
    });
  } catch (err) {
    console.log(err);
  }
  console.log("- end");
  await sleep(100);
  // const account = await program.account.pool.fetch(pool)
  // console.log(account)
}

export async function initSaleManager(
  conn: Connection,
  owner: Keypair,
  pool: PublicKey,
  nft_mint: PublicKey
) {
  console.log("+ initSaleManager");
  let wallet = new anchor.Wallet(owner);
  let provider = new anchor.Provider(
    conn,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  let [sale_manager, bump] = await PublicKey.findProgramAddress(
    [pool.toBuffer(), nft_mint.toBuffer()],
    programId
  );
  try {
    await program.rpc.initSaleManager(new anchor.BN(bump), {
      accounts: {
        owner: owner.publicKey,
        pool: pool,
        nftMint: nft_mint,
        saleManager: sale_manager,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [owner],
    });
  } catch (err) {}
  console.log("- end");
  await sleep(1000);
  // const account = await program.account.saleManager.fetch(sale_manager)
  // console.log(account)
}

export async function sellNft(
  conn: Connection,
  owner: Keypair,
  pool: PublicKey,
  nft_mint: PublicKey,
  nft_seller_token: PublicKey,
  nft_manager_token: PublicKey,
  manager_pot: PublicKey,
  price: number
) {
  console.log("+ sellNft");
  let wallet = new anchor.Wallet(owner);
  let provider = new anchor.Provider(
    conn,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  let sale_manager = (
    await PublicKey.findProgramAddress(
      [pool.toBuffer(), nft_mint.toBuffer()],
      programId
    )
  )[0];
  let metadata = (
    await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        metadataProgramId.toBuffer(),
        nft_mint.toBuffer(),
      ],
      metadataProgramId
    )
  )[0];
  let metadata_extended = (
    await PublicKey.findProgramAddress(
      [nft_mint.toBuffer(), pool.toBuffer(), programId.toBuffer()],
      programId
    )
  )[0];
  let sale_pot = Keypair.generate();

  try {
    await program.rpc.sellNft(new anchor.BN(price), {
      accounts: {
        owner: owner.publicKey,
        pool: pool,
        nftMint: nft_mint,
        metadata: metadata,
        metadataExtended: metadata_extended,
        saleManager: sale_manager,
        salePot: sale_pot.publicKey,
        nftSellerToken: nft_seller_token,
        nftManagerToken: nft_manager_token,
        managerPot: manager_pot,
        tokenMetadataProgram: metadataProgramId,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [owner, sale_pot],
    });
  } catch (err) {
    console.log(err);
  }
  console.log("- end");
  await sleep(1000);
  // const account = await program.account.saleManager.fetch(sale_manager)
  // console.log(account)
}

export async function buyNft(
  conn: Connection,
  owner: Keypair,
  pool: PublicKey,
  nft_mint: PublicKey,
  // nft_manager_token : PublicKey,
  nft_bidder_token: PublicKey,
  // manager_pot : PublicKey,
  bidder_token: PublicKey
) {
  console.log("+ buyNft");
  let wallet = new anchor.Wallet(owner);
  let provider = new anchor.Provider(
    conn,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  let sale_manager = (
    await PublicKey.findProgramAddress(
      [pool.toBuffer(), nft_mint.toBuffer()],
      programId
    )
  )[0];
  let metadata = (
    await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        metadataProgramId.toBuffer(),
        nft_mint.toBuffer(),
      ],
      metadataProgramId
    )
  )[0];
  let sale_manager_data = await program.account.saleManager.fetch(sale_manager);
  let sale_pot_data = await program.account.salePot.fetch(
    sale_manager_data.salePot
  );
  try {
    await program.rpc.buyNft({
      accounts: {
        owner: owner.publicKey,
        pool: pool,
        nftMint: nft_mint,
        metadata: metadata,
        saleManager: sale_manager,
        salePot: sale_manager_data.salePot,
        nftManagerToken: sale_manager_data.nftPot,
        nftBidderToken: nft_bidder_token,
        managerPot: sale_pot_data.poolPot,
        bidderToken: bidder_token,
        tokenMetadataProgram: metadataProgramId,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
      },
      signers: [owner],
    });
  } catch (err) {
    console.log(err);
  }
  console.log("- end");
  await sleep(100);
  const account = await program.account.saleManager.fetch(sale_manager);
  console.log(account);
}

export async function redeemNft(
  conn: Connection,
  owner: Keypair,
  pool: PublicKey,
  nft_mint: PublicKey,
  nft_seller_token: PublicKey
) {
  console.log("+ redeemNft");
  let wallet = new anchor.Wallet(owner);
  let provider = new anchor.Provider(
    conn,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  let sale_manager = (
    await PublicKey.findProgramAddress(
      [pool.toBuffer(), nft_mint.toBuffer()],
      programId
    )
  )[0];
  let metadata = (
    await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        metadataProgramId.toBuffer(),
        nft_mint.toBuffer(),
      ],
      metadataProgramId
    )
  )[0];
  let sale_manager_data = await program.account.saleManager.fetch(sale_manager);
  try {
    await program.rpc.redeemNft({
      accounts: {
        owner: owner.publicKey,
        pool: pool,
        nftMint: nft_mint,
        metadata: metadata,
        saleManager: sale_manager,
        nftSellerToken: nft_seller_token,
        nftManagerToken: sale_manager_data.nftPot,
        tokenMetadataProgram: metadataProgramId,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
      },
      signers: [owner],
    });
  } catch (err) {
    console.log(err);
  }
  console.log("- end");
  await sleep(100);
  // const account = await program.account.saleManager.fetch(sale_manager)
  // console.log(account)
}

export async function withdrawFund(
  conn: Connection,
  owner: Keypair,
  sale_manager: PublicKey,
  withraw_pot: PublicKey
) {
  console.log("+ withdrawFund");
  let wallet = new anchor.Wallet(owner);
  let provider = new anchor.Provider(
    conn,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(idl, programId, provider);
  let sale_manager_data = await program.account.saleManager.fetch(sale_manager);
  let sale_pot_data = await program.account.salePot.fetch(
    sale_manager_data.salePot
  );
  try {
    await program.rpc.withdrawFund({
      accounts: {
        owner: owner.publicKey,
        saleManager: sale_pot_data.saleManager,
        salePot: sale_manager_data.salePot,
        poolPot: sale_pot_data.poolPot,
        withdrawPot: withraw_pot,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
      },
      signers: [owner],
    });
  } catch (err) {
    console.log(err);
  }
  console.log("- end");
  await sleep(100);
  // const account = await program.account.saleManager.fetch(sale_manager)
  // console.log(account)
}
