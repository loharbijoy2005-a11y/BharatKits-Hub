import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Accelerates Vercel build by skipping duplicate typechecks on server
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["nodemailer"],
  poweredByHeader: false,
  compress: true,
  reactStrictMode: false,
};

export default nextConfig;
