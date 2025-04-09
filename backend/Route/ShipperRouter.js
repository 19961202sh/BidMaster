const express = require('express'); 
const shipperRouter = express.Router();

//insert model
const Shipper = require('../Model/ShipperModel.js');
//insert usercontroller
const ShipperController = require('../Controlers/ShipperController.js');

shipperRouter.get('/', ShipperController.getAllShippers);
shipperRouter.post('/', ShipperController.addShippers);
shipperRouter.get("/:shipperid", ShipperController.getByIdShippers);
shipperRouter.put("/:shipperid", ShipperController.updateShippers);
shipperRouter.delete("/:shipperid", ShipperController.deleteShippers);


//export router
module.exports = shipperRouter; 