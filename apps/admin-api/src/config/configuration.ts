import { join } from 'path';

const defaultAppUrl =
  process.env['NODE_ENV'] === 'production'
    ? 'https://api.pharmaconnect-pakistan.com'
    : `http://localhost:${Number(process.env['PORT'] ?? 3000)}`;

export default () => ({
  appName: 'pharma-admin-api',
  environment: process.env['NODE_ENV'] ?? 'development',
  port: Number(process.env['PORT'] ?? 3000),
  appUrl: process.env['APP_URL'] ?? defaultAppUrl,
  uploadDir: process.env['UPLOAD_DIR'] ?? join(process.cwd(), 'uploads'),
  corsOrigin: process.env['CORS_ORIGIN'] ?? '*',
  corsAllowCredentials: process.env['CORS_ALLOW_CREDENTIALS'] !== 'false',
  database: {
    url: process.env['DATABASE_URL'] ?? '',
  },
  jwt: {
    secret: process.env['JWT_SECRET'] ?? '',
    expiresIn: process.env['JWT_EXPIRES_IN'] ?? '15m',
    refreshSecret: process.env['JWT_REFRESH_SECRET'] ?? '',
    refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d',
  },
  throttler: {
    ttl: Number(process.env['THROTTLER_TTL'] ?? 60),
    limit: Number(process.env['THROTTLER_LIMIT'] ?? 100),
  },
});
