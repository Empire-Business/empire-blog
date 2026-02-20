/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use server mode for dashboard (API routes require server)
  // To build static docs site, use: output: 'export'
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Allow experimental features for server components
  experimental: {
    // Enable if needed for future features
  },
}

export default nextConfig
