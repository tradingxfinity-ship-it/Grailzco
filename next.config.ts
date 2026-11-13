import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // How It Works now lives on the homepage.
  async redirects() {
    return [{ source: "/how-it-works", destination: "/#how-it-works", permanent: true }];
  },
};

export default nextConfig;
