/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack(config) {
    config.module.rules.forEach((rule) => {
      const { oneOf } = rule;
      if (oneOf) {
        oneOf.forEach((one) => {
          if (!`${one.issuer?.and}`.includes('_app')) return;
          one.issuer.and = [path.resolve(__dirname)];
        });
      }
    })
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
},
  
}



module.exports = nextConfig
