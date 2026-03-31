import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "https://otm-path-to-growth-portal-production.up.railway.app",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "yt25dlXDIOZmtCV0rZXO/VPFc9B3UhQ/8pLW2UCezt8=",
  },
};

export default nextConfig;
