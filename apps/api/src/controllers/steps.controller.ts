import type { RequestHandler } from 'express';
import { stepsService } from '../services/steps.service.js';
import { success } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

interface StepsController {
  list: RequestHandler;
  getById: RequestHandler<{ stepId: string }>;
}

export const stepsController: StepsController = {
  list: asyncHandler(async (_req, res) => {
    res.json(success(await stepsService.getAllSteps()));
  }),

  getById: asyncHandler<{ stepId: string }>(async (req, res) => {
    res.json(success(await stepsService.getStepById(req.params.stepId)));
  }),
};
