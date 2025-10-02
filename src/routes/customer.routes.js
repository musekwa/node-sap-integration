import express from 'express';
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customer.controller.js';
const router = express.Router();

router.get('/', getCustomers);
router.get('/:cardCode', getCustomer);
router.post('/', createCustomer);
router.patch('/:cardCode', updateCustomer);
router.delete('/:cardCode', deleteCustomer);
export default router;
