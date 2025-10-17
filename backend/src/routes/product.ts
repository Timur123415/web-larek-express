import { Router } from 'express';
import { productValidation } from '../middlewares/validation';
import { createProduct, getProducts } from '../controllers/products';
import catchAsync from '../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(getProducts));

router.post('/', productValidation, catchAsync(createProduct));

export default router;
