const express = require('express');
const app = express();

app.use(express.json());

// Application Configuration from Environment Variables
const APP_ENV = process.env.APP_ENV || 'development';
const DB_HOST = process.env.DB_HOST || 'localhost';
const APP_PORT = process.env.APP_PORT || 8080;

// In-Memory Data Store for Products
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Headphones', price: 149.99, category: 'Audio' }
];

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    environment: APP_ENV,
    dbHost: DB_HOST,
    timestamp: new Date().toISOString()
  });
});

// GET - Get all products
app.get('/products', (req, res) => {
  res.json({ count: products.length, data: products });
});

// GET - Get single product by ID
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST - Add a new product
app.post('/products', (req, res) => {
  const { name, price, category } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const newProduct = {
    id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    price: parseFloat(price),
    category: category || 'General'
  };

  products.push(newProduct);
  res.status(201).json({ message: 'Product added successfully', data: newProduct });
});

// PUT - Update a product
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, price, category } = req.body;
  products[index] = {
    ...products[index],
    ...(name && { name }),
    ...(price != null && { price: parseFloat(price) }),
    ...(category && { category })
  };

  res.json({ message: 'Product updated successfully', data: products[index] });
});

// DELETE - Remove a product
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deletedProduct = products.splice(index, 1);
  res.json({ message: 'Product deleted successfully', data: deletedProduct[0] });
});

// Start Server
app.listen(APP_PORT, () => {
  console.log(`Server running in ${APP_ENV} mode on port ${APP_PORT}`);
  console.log(`Database host target: ${DB_HOST}`);
});