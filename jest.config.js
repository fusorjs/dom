module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest', // fix unexpected export
  },
};
