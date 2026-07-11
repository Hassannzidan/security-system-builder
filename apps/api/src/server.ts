/**
 * Server entry point. Boots the Express app and starts listening.
 */
import { API_BASE_PATH, API_ROUTES } from '@security-system-builder/shared';
import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 API listening on http://localhost:${env.PORT}${API_BASE_PATH}`);
  console.log(`   Health: http://localhost:${env.PORT}${API_BASE_PATH}${API_ROUTES.health}`);
});
