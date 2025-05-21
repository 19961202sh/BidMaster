const express = require('express');
const shipmentRouter = express.Router();
const ShipmentController = require('../Controlers/ShipmentController.js');

shipmentRouter.get('/', ShipmentController.getAllShipments);
shipmentRouter.get('/user', ShipmentController.getUserShipments);
shipmentRouter.post('/pending', ShipmentController.submitShippingDetails);
shipmentRouter.post('/', ShipmentController.addShipments);
shipmentRouter.post('/assign-courier', ShipmentController.assignCourierToCollection);
shipmentRouter.get('/:id', ShipmentController.getByIdShipments);
shipmentRouter.put('/:id', ShipmentController.updateShipmentStatus);
shipmentRouter.delete('/:id', ShipmentController.deleteShipment);

module.exports = shipmentRouter;