const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    supplier: {
      type: String,
      required: [true, 'Supplier is required'],
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: function () {
        return this.quantity > 0;
      },
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  this.inStock = this.quantity > 0;
  next();
});

productSchema.pre('findByIdAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.quantity !== undefined) {
    update.inStock = update.quantity > 0;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
