import { Router } from 'express';
import { orderValidation } from '../middlewares/validation';
import createOrder from '../controllers/order';
import catchAsync from '../utils/catchAsync';

const router = Router();

router.post('/', orderValidation, catchAsync(createOrder));

export default router;
