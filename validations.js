import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password length must be at least 5 symbols').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password length must be at least 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Enter the fullname').isLength({ min: 3 }),
  body('avatarUrl', 'Wrong url to avatar').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Enter article title').isLength({ min: 3 }).isString(),
  body('text', 'Enter article text').isString(),
  body('tags', 'Wrong tag format').optional().isString(),
  body('imageUrl', 'Wrong url to immage').optional().isString(),
];
