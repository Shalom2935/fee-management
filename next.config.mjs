let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
let nextConfig = { // Changed to let to allow modification after merge
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // We will define/override the webpack config after the merge
}

mergeConfig(nextConfig, userConfig)

// Ensure our webpack modifications are robustly applied,
// even if userConfig had its own webpack function.
const originalWebpackConfig = nextConfig.webpack;

nextConfig.webpack = (config, options) => { // options includes { isServer, webpack, defaultLoaders, ... }
  let modifiedConfig = config;

  // If there was a webpack config from userConfig (or the initial one), run it first.
  if (typeof originalWebpackConfig === 'function') {
    modifiedConfig = originalWebpackConfig(modifiedConfig, options);
  }

  // Now, apply our canvas fix to the potentially modified config.
  if (!options.isServer) {
    modifiedConfig.externals = [...(modifiedConfig.externals || []), 'canvas'];
  }
  return modifiedConfig;
};

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
