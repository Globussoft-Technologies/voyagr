import type { NextConfig } from "next";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "lvh.me:3000";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        ROOT,
        `*.${ROOT}`,
      ],
    },
  },
};

export default nextConfig;
