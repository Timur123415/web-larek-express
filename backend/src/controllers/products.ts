import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = (_req: Request, res: Response) => {
  Product.find({})
    .then((foundProducts) => Product.countDocuments()
      .then((productsCount) => {
        res.send({ items: foundProducts, total: productsCount });
      }))
    .catch((_error) => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const createProduct = (req: Request, res: Response, next: any) => {
  const {
    title, image, category, description, price,
  } = req.body;

  Product.create({
    title,
    image,
    category,
    description,
    price,
  })
    .then((createdProduct) => {
      res.send(createdProduct);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Validation failed'));
      }
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(
          new ConflictError('Товар с таким заголовком уже существует.'),
        );
      }
      return next(error);
    });
};
