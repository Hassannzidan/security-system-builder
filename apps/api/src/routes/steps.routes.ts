import { Router } from 'express';
import { stepsController } from '../controllers/steps.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { stepIdParamSchema } from '../validation/steps.validation.js';

export const stepsRouter: Router = Router();

stepsRouter.get('/', stepsController.list);
stepsRouter.get('/:stepId', validate({ params: stepIdParamSchema }), stepsController.getById);
