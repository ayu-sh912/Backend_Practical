const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/products');
const connectDB = require('./config/db');

const PORT = 5000;
const API_PREFIX = '/api';
const NODE_ENV = 'development';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method.padEnd(6);
  const path = req.path;
  console.log(`[${timestamp}] ${method} ${path}`);
  next();
};
app.use(requestLogger);

app.use(`${API_PREFIX}/products`, productRoutes);

app.get(`${API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`\n[ERROR] ${status} - ${message}`);
  console.error('Stack:', err.stack);

  res.status(status).json({
    success: false,
    message,
    ...(NODE_ENV === 'development' && { error: err.stack }),
  });
});

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log('\nInventory Management API Started');
      console.log(`Port: ${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`API Base URL: http://localhost:${PORT}/api\n`);
    });

    const gracefulShutdown = (signal) => {
      console.log(`\n\n[${signal}] Received. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:');
    console.error(`  Error: ${error.message}`);
    console.error(`  Stack: ${error.stack}`);
    process.exit(1);
  }
};

startServer();

process.on('uncaughtException', (err) => {
  console.error('\nUncaught Exception:');
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\nUnhandled Rejection:');
  console.error(`  Promise: ${promise}`);
  console.error(`  Reason: ${reason}`);
  process.exit(1);
});

module.exports = app;
