const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    let query = {};
    if (req.query.category) {
      const categoryRegex = new RegExp(`^${req.query.category.replace('-', ' ')}$`, 'i');
      query.category = categoryRegex;
    }
    if (req.query.isVeg !== undefined) {
      query.isVeg = req.query.isVeg === 'true';
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, title, description, price, category, image, isTrending, isVeg } = req.body;

    const product = await Product.create({
      name,
      title,
      description,
      price,
      category,
      image,
      isTrending,
      isVeg
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.title = req.body.title || product.title;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.image = req.body.image || product.image;
      product.isTrending = req.body.isTrending !== undefined ? req.body.isTrending : product.isTrending;
      product.isVeg = req.body.isVeg !== undefined ? req.body.isVeg : product.isVeg;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
