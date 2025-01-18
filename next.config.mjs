/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["hcm03.vstorage.vngcloud.vn"], // Thêm domain tại đây
  },
};

export default nextConfig;
