import express from 'express';
import { getOrders, getOrder, createOrder, updateOrder, cancelOrder } from '../controllers/order.controller.js';
const router = express.Router();

router.get('/', getOrders);
router.get('/:docEntry', getOrder);
router.post('/', createOrder);
router.patch('/:docEntry', updateOrder);
router.post('/:docEntry/cancel', cancelOrder);
export default router;