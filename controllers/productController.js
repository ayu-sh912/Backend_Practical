const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  try {
    const { productName, quantity, price, supplier } = req.body;

    const product = await Product.create({
      productName,
      quantity,
      price,
      supplier,
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding product',
      error: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving products',
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving product',
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, quantity, price, supplier } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updateData = {};
    if (productName !== undefined) updateData.productName = productName;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (price !== undefined) updateData.price = price;
    if (supplier !== undefined) updateData.supplier = supplier;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = req.query.threshold || 10;

    const products = await Product.find({
      quantity: { $lt: threshold },
    }).sort({ quantity: 1 });

    res.status(200).json({
      success: true,
      threshold: parseInt(threshold),
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving low stock products',
      error: error.message,
    });
  }
};

exports.searchProductByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search term is required',
      });
    }

    const products = await Product.find({
      productName: { $regex: name, $options: 'i' },
    });

    res.status(200).json({
      success: true,
      searchTerm: name,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message,
    });
  }
};

exports.getOutOfStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ inStock: false });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving out of stock products',
      error: error.message,
    });
  }
};
