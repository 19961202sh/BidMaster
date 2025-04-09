const express = require("express");
const router = express.Router();

//insert model
//const User = require("../Model/UserModel");

//insert User control 
const UserControl = require("../Controlers/UserControl");

router.get("/",UserControl.getAllUsers);
router.post("/",UserControl.addUsers);
router.get("/:id",UserControl.getById);
router.put("/:id",UserControl.updateUser);
router.delete("/:id",UserControl.deleteUser);

//export
module.exports = router;

