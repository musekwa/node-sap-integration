import express from 'express';
import { getItems, getItem, createItem, updateItem } from '../controllers/item.controller.js';
const router = express.Router();

router.get('/', getItems);
router.get('/:itemCode', getItem);
router.post('/', createItem);
router.patch('/:itemCode', updateItem);
export default router;