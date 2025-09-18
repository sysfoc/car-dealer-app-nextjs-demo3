// import createNextIntlPlugin from "next-intl/plugin"

// const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts")

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//     serverExternalPackages: ["sharp"],
//   images: {
//     formats: ["image/webp", "image/avif"],
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "*.r2.dev",
//       },
//       {
//         protocol: "https",
//         hostname: "*.r2.cloudflarestorage.com",
//       },
//       {
//         protocol: "https",
//         hostname: "petbazar.com.pk",
//       },
//       {
//         protocol: "http",
//         hostname: "localhost",
//       },
//     ],
//     unoptimized: true,
//   },
// }

// export default withNextIntl(nextConfig)

import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["sharp"],
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "petbazar.com.pk",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    // Remove this if you want Next.js image optimization
    // unoptimized: true,
  },
  
  // Bundle splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups.default.minChunks = 2;
    }
    return config;
  },
}

export default withNextIntl(nextConfig)