module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   '<rootDir>/components/**/*.vue',
  //   '<rootDir>/pages/**/*.vue',
  // ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  // silent: true,
  coveragePathIgnorePatterns: [
    '<rootDir>/src/assets/vendor',
    '<rootDir>/src/components/field-renderer',
  ],
}
