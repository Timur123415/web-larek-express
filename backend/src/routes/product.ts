import { Router } from 'express';
import { productValidation } from '../middlewares/validation';
import { createProduct, getProducts } from '../controllers/products';

const router = Router();

router.get('/', getProducts);

router.post('/', productValidation, createProduct);

export default router;
