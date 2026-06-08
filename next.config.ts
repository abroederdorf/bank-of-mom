import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: "/bank-of-mom",
  assetPrefix: "/bank-of-mom",
};

export default nextConfig;
