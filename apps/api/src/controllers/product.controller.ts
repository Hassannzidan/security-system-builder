import type { Request, Response } from 'express';
import { productService } from '../services/product.service.js';
import { success } from '../utils/response.js';

export const productController = {
  list(_req: Request, res: Response): void {
    res.json(success(productService.findAll()));
  },
};
