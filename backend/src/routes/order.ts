import { Router } from 'express';
import { orderValidation } from '../middlewares/validation';
import createOrder from '../controllers/order';

const router = Router();

router.post('/', orderValidation, createOrder);

export default router;
