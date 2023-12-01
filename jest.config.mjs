import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  testEnvironment: "jest-environment-jsdom",
  transformIgnorePatterns: [],
  resetMocks: true,
};

export default async function configFn() {
  const nextConfig = await createJestConfig(config)();

  return {
    ...nextConfig,
    transformIgnorePatterns: ["^.+\\.module\\.(css|sass|scss)$"],
  };
}
