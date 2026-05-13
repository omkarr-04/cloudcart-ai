import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        'src/config.ts', // Environment config logic
        'src/index.ts', // Server startup logic
      ],
      // Thresholds to ensure we don't regress in the future
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    },
    // We run tests serially because they hit a real database (integration tests)
    fileParallelism: false, 
  },
});
