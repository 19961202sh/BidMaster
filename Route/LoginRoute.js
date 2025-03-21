const express = require("express");
const router = express.Router();

//insert model
const User = require("../Model/LoginModel");

//insert login control 
const LoginControl = require("../Controlers/LoginControl");

router.get("/",LoginControl.getAllUsers);
router.post("/",LoginControl.addUsers);
router.post("/:id",LoginControl.getById);
router.put("/:id",LoginControl.updateUser);
router.delete("/:id",LoginControl.deleteUser);


//export
module.exports = router;

