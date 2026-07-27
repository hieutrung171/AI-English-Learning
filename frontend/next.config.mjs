/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker builds use standalone output. Local Windows builds avoid symlink
  // restrictions while keeping the same application code.
  output: process.env.DOCKER_BUILD === "1" ? "standalone" : undefined,
};

export default nextConfig;
