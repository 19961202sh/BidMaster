const Shipments = require("../Model/ShipmentModel.js");

const getAllShipments = async (req, res, next) => {
  try {
    const shipments = await Shipments.find();
    if (!shipments) {
      return res.status(404).json({ message: "No shipments found" });
    }
    res.status(200).json(shipments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addShipments = async (req, res, next) => {
  const {
    itemid,
    itemname,
    from,
    to,
    sellername,
    selleremail,
    sellerphone,
    buyername,
    buyeremail,
    buyerphone,
    weight,
    shipmenttype,
    cost,
  } = req.body;
  try {
    const shipments = new Shipments({
      itemid: itemid,
      itemname: itemname,
      from: from,
      to: to,
      sellername: sellername,
      selleremail: selleremail,
      sellerphone: sellerphone,
      buyername: buyername,
      buyeremail: buyeremail,
      buyerphone: buyerphone,
      weight: weight,
      shipmenttype: shipmenttype,
      cost: cost,
    });
    await shipments.save();
    res.status(201).json({ message: "Shipment added", shipments }); // Single response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get by id
const getByIdShipments = async (req, res, next) => {
  const { shipid } = req.params;
  let shipments;
  try {
    shipments = await Shipments.findById(shipid);
    if (!shipments) {
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.status(200).json(shipments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//update User detail
const updateShipments = async (req, res, next) => {
  const { shipid } = req.params;
  const {
    itemid,
    itemname,
    from,
    to,
    sellername,
    selleremail,
    sellerphone,
    buyername,
    buyeremail,
    buyerphone,
    weight,
    shipmenttype,
    cost,
  } = req.body;
  let shipments;

  try {
    shipments = await Shipments.findByIdAndUpdate(
      shipid,
      {
        itemid: itemid,
        itemname: itemname,
        from: from,
        to: to,
        sellername: sellername,
        selleremail: selleremail,
        sellerphone: sellerphone,
        buyername: buyername,
        buyeremail: buyeremail,
        buyerphone: buyerphone,
        weight: weight,
        shipmenttype: shipmenttype,
        cost: cost,
      },
      { new: true }
    );
    //save the updated data
    //shipments = await shipments.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

  if (!shipments) {
    return res.status(404).json({ message: "Unable to update" });
  }
  res.status(200).json({ message: "Shipment updated", shipments });
};

//delete user details

const deleteShipments = async (req, res, next) => {
  const shipid = req.params.id;

  //create variable
  let shipments;

  try {
    shipments = await Shipments.findByIdAndDelete(shipid);
  } catch (err) {
    console.log(err);
  }

  if (!shipments) {
    return res
      .status(404)
      .json({ message: "Unable to delete -Shipment not found " });
  }

  return res.status(200).json({ message: "Shipment deleted", shipments });
};

// const getUserShipments = async (req, res, next) => {
//   try {
//     const shipments = await Shipments.find({
//       $or: [{ selleremail: req.body.email }, { buyeremail: req.body.email }],
//     }).sort({ createdAt: -1 });
//     res.status(200).json(shipments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.getAllShipments = getAllShipments;
exports.addShipments = addShipments;
exports.getByIdShipments = getByIdShipments;
exports.updateShipments = updateShipments;
exports.deleteShipments = deleteShipments;
//exports.getUserShipments = getUserShipments;
