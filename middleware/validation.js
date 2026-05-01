const { body, param, validationResult, query } = require('express-validator');

const validateProductCreation = [
  body('productName')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 characters'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Quantity cannot be negative');
      }
      return true;
    }),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('supplier')
    .notEmpty()
    .withMessage('Supplier is required')
    .trim(),
];

const validateProductUpdate = [
  body('quantity')
    .optional()
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Quantity cannot be negative');
      }
      return true;
    }),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('productName')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 characters'),
  body('supplier').optional().trim(),
];

const validateProductId = [
  param('id').isMongoId().withMessage('Invalid product ID'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  validateProductCreation,
  validateProductUpdate,
  validateProductId,
  handleValidationErrors,
};
