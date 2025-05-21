const Shipment = require('../Model/ShipmentModel.js');
const Shipper = require('../Model/ShipperModel.js');
const PendingShipment = require('../Model/PendingShipmentModel.js');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendNotification = async (email, subject, message) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: message
  });
};

const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json({ success: true, data: shipments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addShipments = async (req, res) => {
  const {
    itemid,
    itemname,
    from,
    collectionCenter,
    to,
    userName,
    selleremail,
    phone,
    buyername,
    buyeremail,
    buyerphone,
    weight,
    shipmenttype,
    cost,
    courieridToCollection,
    courieridToBuyer,
    status
  } = req.body;

  try {
    // Validate required fields
    if (!itemid || !itemname || !from || !to || !userName || !selleremail || !phone || 
        !buyername || !buyeremail || !buyerphone || !weight || !shipmenttype || !cost) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields',
        errors: {
          itemid: !itemid ? 'Item ID is required' : null,
          itemname: !itemname ? 'Item name is required' : null,
          from: !from ? 'Pickup address is required' : null,
          to: !to ? 'Delivery address is required' : null,
          userName: !userName ? 'Seller name is required' : null,
          selleremail: !selleremail ? 'Seller email is required' : null,
          phone: !phone ? 'Seller phone is required' : null,
          buyername: !buyername ? 'Buyer name is required' : null,
          buyeremail: !buyeremail ? 'Buyer email is required' : null,
          buyerphone: !buyerphone ? 'Buyer phone is required' : null,
          weight: !weight ? 'Weight is required' : null,
          shipmenttype: !shipmenttype ? 'Shipment type is required' : null,
          cost: !cost ? 'Cost is required' : null
        }
      });
    }

    // Create new shipment
    const shipment = new Shipment({
      itemid,
      itemname,
      from,
      collectionCenter: collectionCenter || 'Main Collection Center',
      to,
      userName,
      selleremail,
      phone,
      buyername,
      buyeremail,
      buyerphone,
      weight: Number(weight),
      shipmenttype,
      cost: Number(cost),
      courieridToCollection,
      courieridToBuyer,
      status: status || 'Pending'
    });

    await shipment.save();

    // Try to send notifications, but don't fail if they don't work
    try {
      await sendNotification(
        selleremail,
        'Shipment Created',
        `Your shipment ${itemid} has been created and is pending courier assignment.`
      );
    } catch (emailError) {
      console.error('Failed to send seller notification:', emailError);
    }

    try {
      await sendNotification(
        buyeremail,
        'Shipment Created',
        `A shipment for item ${itemname} has been created and is pending courier assignment.`
      );
    } catch (emailError) {
      console.error('Failed to send buyer notification:', emailError);
    }

    // Emit socket event if available
    if (req.io) {
      req.io.emit('shipmentUpdate', { itemid, status: shipment.status });
    }

    res.status(201).json({ success: true, data: shipment });
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      errors: error.errors
    });
  }
};

const getUserShipments = async (req, res) => {
  try {
    const { email } = req.query;
    const shipments = await Shipment.find({
      $or: [{ selleremail: email }, { buyeremail: email }]
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: shipments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitShippingDetails = async (req, res) => {
  const { auctionid, userType, details } = req.body;
  try {
    let pendingShipment = await PendingShipment.findOne({ auctionid });
    if (!pendingShipment) {
      pendingShipment = new PendingShipment({ auctionid, [userType + 'Details']: details });
    } else {
      pendingShipment[userType + 'Details'] = details;
    }
    await pendingShipment.save();

    if (pendingShipment.buyerDetails && pendingShipment.sellerDetails) {
      const shipment = new Shipment({
        itemid: pendingShipment.sellerDetails.itemid,
        itemname: pendingShipment.sellerDetails.itemname,
        from: pendingShipment.sellerDetails.from,
        collectionCenter: pendingShipment.collectionCenter,
        to: pendingShipment.buyerDetails.to,
        userName: pendingShipment.sellerDetails.userName,
        selleremail: pendingShipment.sellerDetails.selleremail,
        phone: pendingShipment.sellerDetails.phone,
        buyername: pendingShipment.buyerDetails.buyername,
        buyeremail: pendingShipment.buyerDetails.buyeremail,
        buyerphone: pendingShipment.buyerDetails.buyerphone,
        weight: pendingShipment.sellerDetails.weight,
        shipmenttype: pendingShipment.sellerDetails.shipmenttype,
        cost: 0 // Cost will be set after courier assignment
      });
      await shipment.save();
      await PendingShipment.deleteOne({ auctionid });
      await sendNotification(
        shipment.selleremail,
        'Shipment Created',
        `Your shipment ${shipment.itemid} has been created and is pending courier assignment to the collection center.`
      );
      await sendNotification(
        shipment.buyeremail,
        'Shipment Created',
        `A shipment for item ${shipment.itemname} has been created and is pending courier assignment.`
      );
      req.io.emit('shipmentUpdate', { itemid: shipment.itemid, status: shipment.status });
      res.status(201).json({ success: true, data: shipment });
    } else {
      res.status(200).json({ success: true, message: 'Details submitted, awaiting other party' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const assignCourierToCollection = async (req, res) => {
  const { shipmentId, courierid, field } = req.body;
  try {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
    
    const courier = await Shipper.findOne({ providerid: courierid });
    if (!courier) return res.status(404).json({ success: false, message: 'Courier not found' });

    // Update the appropriate courier field
    if (field === 'courieridToCollection') {
      shipment.courieridToCollection = courierid;
      shipment.status = 'Courier Assigned to Collection';
      shipment.cost = shipment.weight * courier.rateperkg; // Calculate cost for first leg
    } else if (field === 'courieridToBuyer') {
      shipment.courieridToBuyer = courierid;
      shipment.status = 'Courier Assigned to Buyer';
      shipment.cost += shipment.weight * courier.rateperkg; // Add cost for second leg
    }

    await shipment.save();

    // Send notifications
    const notificationMessage = field === 'courieridToCollection'
      ? `A courier (${courier.companyname}) has been assigned to pick up your shipment ${shipment.itemid} and deliver it to the collection center.`
      : `A courier (${courier.companyname}) has been assigned to deliver your shipment ${shipment.itemid} from the collection center to the buyer.`;

    await sendNotification(
      shipment.selleremail,
      'Courier Assigned',
      notificationMessage
    );

    await sendNotification(
      shipment.buyeremail,
      'Shipment Update',
      `A courier has been assigned for item ${shipment.itemname} to deliver ${field === 'courieridToCollection' ? 'to the collection center' : 'to your address'}.`
    );

    req.io.emit('shipmentUpdate', { itemid: shipment.itemid, status: shipment.status });
    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateShipmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status, courieridToBuyer } = req.body;
  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });

    if (status) shipment.status = status;
    if (courieridToBuyer) {
      const courier = await Shipper.findOne({ providerid: courieridToBuyer });
      if (!courier) return res.status(404).json({ success: false, message: 'Courier not found' });
      shipment.courieridToBuyer = courieridToBuyer;
      shipment.cost += shipment.weight * courier.rateperkg; // Add cost for second leg
    }

    await shipment.save();

    let sellerMessage = '';
    let buyerMessage = '';

    switch (status) {
      case 'Picked Up':
        sellerMessage = `Your shipment ${shipment.itemid} has been picked up by the courier.`;
        buyerMessage = `The shipment for item ${shipment.itemname} has been picked up and is en route to the collection center.`;
        break;
      case 'At Collection Center':
        sellerMessage = `Your shipment ${shipment.itemid} has arrived at the collection center.`;
        buyerMessage = `The shipment for item ${shipment.itemname} has arrived at the collection center and will be shipped to you soon.`;
        break;
      case 'Courier Assigned to Buyer':
        sellerMessage = `A courier has been assigned to deliver your shipment ${shipment.itemid} from the collection center to the buyer.`;
        buyerMessage = `A courier has been assigned to deliver your item ${shipment.itemname} to your address.`;
        break;
      case 'Shipped to Buyer':
        sellerMessage = `Your shipment ${shipment.itemid} has been shipped from the collection center to the buyer.`;
        buyerMessage = `Your item ${shipment.itemname} has been shipped and is on its way to you.`;
        break;
      case 'Delivered':
        sellerMessage = `Your shipment ${shipment.itemid} has been delivered to the buyer.`;
        buyerMessage = `Your item ${shipment.itemname} has been delivered.`;
        break;
      case 'Cancelled':
        sellerMessage = `Your shipment ${shipment.itemid} has been cancelled.`;
        buyerMessage = `The shipment for item ${shipment.itemname} has been cancelled.`;
        break;
    }

    if (sellerMessage) await sendNotification(shipment.selleremail, `Shipment ${shipment.itemid} Update`, sellerMessage);
    if (buyerMessage) await sendNotification(shipment.buyeremail, `Shipment ${shipment.itemname} Update`, buyerMessage);

    req.io.emit('shipmentUpdate', { itemid: shipment.itemid, status: shipment.status });
    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getByIdShipments = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
    await sendNotification(
      shipment.selleremail,
      'Shipment Cancelled',
      `Your shipment ${shipment.itemid} has been cancelled and deleted.`
    );
    await sendNotification(
      shipment.buyeremail,
      'Shipment Cancelled',
      `The shipment for item ${shipment.itemname} has been cancelled and deleted.`
    );
    res.status(200).json({ success: true, message: 'Shipment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllShipments,
  addShipments,
  getUserShipments,
  submitShippingDetails,
  assignCourierToCollection,
  updateShipmentStatus,
  getByIdShipments,
  deleteShipment
};



/*const Shipment = require('../Models/ShipmentModel.js');
const Shipper = require('../Models/ShipperModel.js');
const PendingShipment = require('../Models/PendingShipmentModel.js');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendNotification = async (email, subject, message) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text: message
    });
};

const assignCourier = async (shipmenttype) => {
    const couriers = await Shipper.find({ companytype: shipmenttype });
    if (!couriers.length) throw new Error('No couriers available');
    return couriers.reduce((min, curr) => curr.rateperkg < min.rateperkg ? curr : min).providerid;
};

const getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find();
        res.status(200).json({ success: true, data: shipments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addShipments = async (req, res, next) => {
  const {
    itemid,
    itemname,
    from,
    to,
    userName,
    email,
    phone,
    
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
      userName: userName,
      email: email,
      phone: phone,
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

const getUserShipments = async (req, res) => {
    try {
        const { email } = req.query;
        const shipments = await Shipment.find({
            $or: [{email: email }]
        }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: shipments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const submitShippingDetails = async (req, res) => {
    const { auctionid, userType, details } = req.body;
    try {
        let pendingShipment = await PendingShipment.findOne({ auctionid });
        if (!pendingShipment) {
            pendingShipment = new PendingShipment({ auctionid, [userType + 'Details']: details });
        } else {
            pendingShipment[userType + 'Details'] = details;
        }
        await pendingShipment.save();

        if (pendingShipment.buyerDetails && pendingShipment.sellerDetails) {
            const courierid = await assignCourier(pendingShipment.sellerDetails.shipmenttype);
            const courier = await Shipper.findOne({ providerid: courierid });
            const cost = pendingShipment.sellerDetails.weight * courier.rateperkg;
            const shipment = new Shipment({
                itemid: pendingShipment.sellerDetails.itemid,
                itemname: pendingShipment.sellerDetails.itemname,
                from: pendingShipment.sellerDetails.from,
                to: pendingShipment.buyerDetails.to,
                userName: pendingShipment.sellerDetails.userName,
                selleremail: pendingShipment.sellerDetails.email,
                phone: pendingShipment.sellerDetails.phone,
                //buyername: pendingShipment.buyerDetails.buyername,
                //buyeremail: pendingShipment.buyerDetails.buyeremail,
                //buyerphone: pendingShipment.buyerDetails.buyerphone,
                weight: pendingShipment.sellerDetails.weight,
                shipmenttype: pendingShipment.sellerDetails.shipmenttype,
                cost,
                courierid
            });
            await shipment.save();
            await PendingShipment.deleteOne({ auctionid });
            await sendNotification(shipment.email, 'Shipment Created', `Your shipment ${shipment.itemid} is pending.`);
           req.io.emit('shipmentUpdate', { itemid: shipment.itemid, status: shipment.status });
            res.status(201).json({ success: true, data: shipment });
        } else {
            res.status(200).json({ success: true, message: 'Details submitted, awaiting other party' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getByIdShipments = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
        res.status(200).json({ success: true, data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateShipment = async (req, res) => {
    const { id } = req.params;
    const { status, courierid, cost } = req.body;
    try {
        const shipment = await Shipment.findByIdAndUpdate(id, { status, courierid, cost }, { new: true });
        if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
        if (status) {
            await sendNotification(shipment.email, `Shipment ${shipment.itemid} Updated`, `Status: ${status}`);
            req.io.emit('shipmentUpdate', { itemid: shipment.itemid, status });
        }
        res.status(200).json({ success: true, data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findByIdAndDelete(req.params.id);
        if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
        res.status(200).json({ success: true, message: 'Shipment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { 
  getAllShipments, 
  addShipments,
  getUserShipments, 
  submitShippingDetails, 
  getByIdShipments, 
  updateShipment, 
  deleteShipment };


//////////////////////////////////////////////////////////////
worked inthe mid
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
*/