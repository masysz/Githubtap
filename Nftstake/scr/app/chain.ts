import { defineChain } from "thirdweb";

export const chain = defineChain(parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!) || 8453);
