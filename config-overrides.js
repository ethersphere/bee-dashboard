module.exports = function override(config, env) {
  const fallbackObject = {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  }

  if (!config.resolve) {
    config.resolve = fallbackObject
  } else {
    config.resolve.fallback = { ...config.resolve.fallback, ...fallbackObject.fallback }
  }

  return config
}
