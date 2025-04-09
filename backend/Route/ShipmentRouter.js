const express = require('express'); 
const shipmentRouter = express.Router();

//insert model
const Shipment = require('../Model/ShipmentModel.js');
//insert usercontroller
const ShipmentController = require('../Controlers/ShipmentController.js');

shipmentRouter.get('/', ShipmentController.getAllShipments);
shipmentRouter.post('/', ShipmentController.addShipments);
shipmentRouter.get("/:shipid", ShipmentController.getByIdShipments);
shipmentRouter.put("/:shipid", ShipmentController.updateShipments);
shipmentRouter.delete("/:shipid", ShipmentController.deleteShipments);
//shipmentRouter.get("/:selleremail", ShipmentController.getUserShipments);
//export router
module.exports = shipmentRouter; 