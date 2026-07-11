import type { Request, Response } from 'express';
import type { HealthStatus } from '@security-system-builder/shared';
import { success } from '../utils/response.js';

export const healthController = {
  check(_req: Request, res: Response): void {
    const payload: HealthStatus = {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
    res.json(success(payload));
  },
};
