const express = require('express');
const router = express.Router();
const itemController = require('../Controlers/SellItemController');

// GET all items
router.get('/', itemController.getAllItems);

// POST create new item with image upload
router.post('/', itemController.upload.single('image'), itemController.createItem);

// GET single item by ID
router.get('/:id', itemController.getItemById);

// PUT update item
router.put('/:id', itemController.updateItem);

// DELETE item
router.delete('/:id', itemController.deleteItem);

module.exports = router;