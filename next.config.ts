import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    dangerouslyAllowSVG: true, // Allows SVGs in next/image
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};


export default nextConfig;
