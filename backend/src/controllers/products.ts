import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const foundProducts = await Product.find({});
    const productsCount = await Product.countDocuments();
    res.send({ items: foundProducts, total: productsCount });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body;
    const createdProduct = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });
    return res.send(createdProduct);
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Validation failed'));
    }
    if (error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует.'));
    }
    return next(error);
  }
};
