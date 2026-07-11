import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';

export const productRouter: Router = Router();

productRouter.get('/', productController.list);
