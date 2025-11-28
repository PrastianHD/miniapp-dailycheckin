import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ignore React Native Async Storage in web builds
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    // Existing externals
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    return config;
  }
};

export default nextConfig;