import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.', 
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

export default config;
