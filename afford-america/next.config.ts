import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app lives inside a repo that has its own Next.js app at the root;
  // pin the workspace root so the parent app's files are never picked up.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
