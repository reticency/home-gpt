/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com'],
  },
};

module.exports = nextConfig;
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
