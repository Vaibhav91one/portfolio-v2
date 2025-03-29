import { NextConfig } from "next";

const nextConfig : NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"], // Allows importing SVGs as React components
    });
    return config;
  },
  images: {
    dangerouslyAllowSVG: true, // Allows SVGs in next/image
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig; // Ensure correct export format
