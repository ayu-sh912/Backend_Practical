const express = require('express');
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  searchProductByName,
  getOutOfStockProducts,
} = require('../controllers/productController');
const {
  validateProductCreation,
  validateProductUpdate,
  validateProductId,
  handleValidationErrors,
} = require('../middleware/validation');


router.post('/', validateProductCreation, handleValidationErrors, addProduct);

router.get('/', getAllProducts);

router.get('/filter/lowstock', getLowStockProducts);

router.get('/filter/outofstock', getOutOfStockProducts);

router.get('/search/:name', searchProductByName);

router.get('/:id', validateProductId, handleValidationErrors, getProductById);

router.put(
  '/:id',
  validateProductId,
  validateProductUpdate,
  handleValidationErrors,
  updateProduct
);

router.delete(
  '/:id',
  validateProductId,
  handleValidationErrors,
  deleteProduct
);

module.exports = router;
