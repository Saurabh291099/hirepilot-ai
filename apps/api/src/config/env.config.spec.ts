import { validateEnvironment } from './env.config';

describe('validateEnvironment', () => {
  it('applies safe defaults for local development', () => {
    expect(validateEnvironment({})).toEqual({
      NODE_ENV: 'development',
      PORT: 3001,
      JWT_SECRET: 'jobpilot-local-development-secret-change-me',
    });
  });

  it('coerces a valid port and environment', () => {
    expect(validateEnvironment({ NODE_ENV: 'test', PORT: '4010' })).toEqual({
      NODE_ENV: 'test',
      PORT: 4010,
      JWT_SECRET: 'jobpilot-local-development-secret-change-me',
    });
  });

  it('rejects an invalid port', () => {
    expect(() => validateEnvironment({ PORT: 'not-a-port' })).toThrow(
      'Invalid environment configuration',
    );
  });
});
