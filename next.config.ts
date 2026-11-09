import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@ast-grep/napi", "postgres"],
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
  ],
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: "canvas" }];
    return config;
  },
};

export default nextConfig;
