const { config } = require('process')

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack:(config,{ buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
        config.module.rules.push({
            test: /\.lua$/,
            type: 'asset/source'
        })
        return config
    }
}

module.exports = nextConfig
