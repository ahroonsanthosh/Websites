import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages ? { output: "export" } : {}),
  basePath: isGitHubPages ? "/Uncles" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/Uncles" : "",
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
