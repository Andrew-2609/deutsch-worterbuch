import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  roots: ['<rootDir>'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/handler/*.ts',
    '!**/*test*/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testEnvironment: 'jest-environment-node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  testMatch: ["**/*.test.ts"]
}

export default config
