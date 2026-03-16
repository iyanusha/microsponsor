import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  },
  // Prevent @stacks/connect (browser-only) from being bundled server-side.
  // Belt-and-suspenders alongside the dynamic import() pattern in useWallet
  // and the contract write functions.
  serverExternalPackages: ['@stacks/connect', '@stacks/connect-ui'],
  turbopack: {
    // Silence "multiple lockfiles" warning by pointing to this project's root.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
