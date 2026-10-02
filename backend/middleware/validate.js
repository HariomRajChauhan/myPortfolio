import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(422).json({
    message: 'Validation failed',
    errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
  });
};

export default validate;
