import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password must contain at least 4 symbols').isLength({
        min: 4,
    }),
];

export const registerValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password must contain at least 4 symbols').isLength({
        min: 4,
    }),
    body('firstName', 'Firstname must contain at least 3 symbols').isLength({
        min: 3,
    }),
    body('lastName', 'Lastname must contain at least 3 symbols').isLength({
        min: 3,
    }),
];
