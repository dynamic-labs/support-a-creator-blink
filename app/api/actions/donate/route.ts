import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from "@solana/actions"
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./const";

export const GET = (req: Request) => {
    try {
        const requestUrl = new URL(req.url);
        const { toPubkey } = validatedQueryParams(requestUrl);

        const baseHref = new URL(
        `/api/actions/support?to=${toPubkey.toBase58()}`,
        requestUrl.origin,
        ).toString();

        const payload: ActionGetResponse = {
            icon: new URL("/support.svg", new URL(req.url ?? "").origin).toString(),
            title: "Donate",
            label: "Support",
            description: "Support the creator",
            links: {
                actions: [
                {
                    label: "Send 1 SOL", // button text
                    href: `${baseHref}&amount=${"1"}`,
                },
                {
                    label: "Send 5 SOL", // button text
                    href: `${baseHref}&amount=${"5"}`,
                },
                {
                    label: "Send 10 SOL", // button text
                    href: `${baseHref}&amount=${"10"}`,
                },
                {
                    label: "Send SOL", // button text
                    href: `${baseHref}&amount={amount}`, // this href will have a text input
                    parameters: [
                    {
                        name: "amount", // parameter name in the `href` above
                        label: "Enter the amount of SOL to send", // placeholder of the text input
                        required: true,
                    },
                    ],
                },
                ],
            },
        } 
        return Response.json({payload, headers: ACTIONS_CORS_HEADERS})
    } catch (err) {
        console.log(err);
        let message = "An unknown error occurred";
        if (typeof err == "string") message = err;
        return new Response(message, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
    }
} 

export const OPTIONS = GET;

export const POST = async (req: Request) => {

    try {
        const requestUrl = new URL(req.url);
        const { amount, toPubkey } = validatedQueryParams(requestUrl);
        const body: ActionPostRequest = await req.json();

        let account: PublicKey;

        try {
            account = new PublicKey(body.account);
        } catch(e) {
            return new Response('Invalid "account" provided', {
                status: 400,
                headers: ACTIONS_CORS_HEADERS,
              });
        }

        const connection = new Connection(clusterApiUrl('devnet'));

        // ensure the receiving account will be rent exempt
        const minimumBalance = await connection.getMinimumBalanceForRentExemption(
            0, // note: simple accounts that just store native SOL have `0` bytes of data
        );
        if (amount * LAMPORTS_PER_SOL < minimumBalance) {
            throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
        }

        const transaction = new Transaction()

        transaction.add(
            SystemProgram.transfer({
              fromPubkey: account,
              toPubkey: toPubkey,
              lamports: amount * LAMPORTS_PER_SOL,
            }),
          );

        transaction.feePayer = account;

        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: `Send ${amount} SOL to ${toPubkey.toBase58()}`,
            }
        });

        return Response.json({payload, headers: ACTIONS_CORS_HEADERS}); // eslint-disable-line
    } catch(e) {
        console.log(e);
        let message = "An unknown error occurred";
        if (typeof e == "string") message = e;
        return new Response(message, {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });

    }
}

function validatedQueryParams(requestUrl: URL): { amount: number; toPubkey: PublicKey } {
    let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;
    let amount: number = DEFAULT_SOL_AMOUNT;
  
    try {
      if (requestUrl.searchParams.get("to")) {
        toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
      }
    } catch (err) {
      throw "Invalid input query parameter: to";
    }
  
    try {
      if (requestUrl.searchParams.get("amount")) {
        amount = parseFloat(requestUrl.searchParams.get("amount")!);
      }
  
      if (amount <= 0) throw "amount is too small";
    } catch (err) {
      throw "Invalid input query parameter: amount";
    }
  
    return {
      amount,
      toPubkey,
    };
  }