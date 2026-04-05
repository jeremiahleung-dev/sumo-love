import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const baseConfig: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

// next/jest sets its own transformIgnorePatterns — we must override after merging
export default async function config(): Promise<Config> {
  const nextConfig = await createJestConfig(baseConfig)() as Config
  return {
    ...nextConfig,
    transformIgnorePatterns: [
      '/node_modules/(?!(cheerio|parse5|htmlparser2|domhandler|domutils|css-select|css-what|nth-check|boolbase|entities)/)',
    ],
  }
}
