import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚡ 1. Rust-powered High-Speed Package Imports (Prevents parsing thousands of unused icons/modules)
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      "bignumber.js",
    ],
  },

  // ⚡ 2. Optimize server external packages
  serverExternalPackages: ["nodemailer"],

  // ⚡ 4. Disable X-Powered-By header for security & speed
  poweredByHeader: false,

  // ⚡ 5. Enable Gzip/Brotli compression
  compress: true,

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
