import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errors } from 'celebrate';
import productRouter from './routes/product';
import errorsHandler from './middlewares/errors';
import orderRouter from './routes/order';
import { errorLogger, requestLogger } from './middlewares/logger';

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect('mongodb://127.0.0.1:27017/weblarek');

app.use(cors());
app.use(requestLogger);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
