import express from 'express';
import customerRoutes from './customer.routes.js';
import itemRoutes from './item.routes.js';
import orderRoutes from './order.routes.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API is running', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version,
    });
});
router.use('/customers', customerRoutes);
router.use('/items', itemRoutes);
router.use('/orders', orderRoutes);
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API is running', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version,
    });
});

export default router;