import mongoose, { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/product';

import BadRequestError from '../errors/bad-request-error';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body;
    const productObjectIds = items.map((id: string) => new Types.ObjectId(id));

    const foundProducts = await Product.find({
      _id: { $in: productObjectIds },
    });

    const notFoundProductIds = items.filter(
      (id: string) => !foundProducts.some((product: IProduct) => product._id!.toString() === id),
    );

    if (notFoundProductIds.length > 0) {
      throw new BadRequestError(`Товар с id ${notFoundProductIds.join(', ')} не найден`);
    }

    const notForSaleProductIds = items.filter(
      (id: string) => !foundProducts.some(
        (product: IProduct) => product._id!.toString() === id && product.price !== null,
      ),
    );

    if (notForSaleProductIds.length > 0) {
      throw new BadRequestError(`Товар с id ${notForSaleProductIds.join(', ')} не продаётся`);
    }

    const totalPrice = foundProducts.reduce(
      (sum: number, product: IProduct) => sum + product.price!,
      0,
    );

    if (totalPrice !== total) {
      throw new BadRequestError('Неверная сумма');
    }

    const orderId = faker.string.uuid();
    return res.send({ id: orderId, total });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Validation failed'));
    }
    return next(error);
  }
};
