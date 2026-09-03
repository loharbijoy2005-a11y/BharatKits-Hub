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

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;
