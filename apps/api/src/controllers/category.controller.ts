import type { Request, Response } from 'express';
import { categoryService } from '../services/category.service.js';
import { success } from '../utils/response.js';

export const categoryController = {
  list(_req: Request, res: Response): void {
    res.json(success(categoryService.findAll()));
  },
};
