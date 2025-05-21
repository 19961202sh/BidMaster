//insert model

const Shipper = require('../Model/ShipperModel.js');

const getAllShippers = async (req, res) => {
    try {
        const shippers = await Shipper.find();
        res.status(200).json({ success: true, data: shippers });
    } catch (error) {
        console.error('Error fetching shippers:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const addShipper = async (req, res) => {
    const { providerid, companyname, companyemail, companyphone, companyaddress, companytype, rateperkg } = req.body;
    try {
        const shipper = new Shipper({
            providerid, companyname, companyemail, companyphone, companyaddress, companytype, rateperkg
        });
        await shipper.save();
        res.status(201).json({ success: true, data: shipper });
    } catch (error) {
        console.error('Error creating shipper:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getByIdShipper = async (req, res) => {
    try {
        const shipper = await Shipper.findById(req.params.shipperid);
        if (!shipper) return res.status(404).json({ success: false, message: 'Shipper not found' });
        res.status(200).json({ success: true, data: shipper });
    } catch (error) {
        console.error('Error fetching shipper:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateShipper = async (req, res) => {
    const { shipperid } = req.params;
    const { providerid, companyname, companyemail, companyphone, companyaddress, companytype, rateperkg } = req.body;
    try {
        const shipper = await Shipper.findByIdAndUpdate(
            shipperid,
            { providerid, companyname, companyemail, companyphone, companyaddress, companytype, rateperkg },
            { new: true }
        );
        if (!shipper) return res.status(404).json({ success: false, message: 'Shipper not found' });
        res.status(200).json({ success: true, data: shipper });
    } catch (error) {
        console.error('Error updating shipper:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteShipper = async (req, res) => {
    try {
        const shipper = await Shipper.findByIdAndDelete(req.params.shipperid);
        if (!shipper) return res.status(404).json({ success: false, message: 'Shipper not found' });
        res.status(200).json({ success: true, message: 'Shipper deleted successfully' });
    } catch (error) {
        console.error('Error deleting shipper:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllShippers, addShipper, getByIdShipper, updateShipper, deleteShipper };

/*


const getAllShippers = async(req,res,next) =>{

    let shippers;


    try{
        shippers = await Shippers.find();

    }catch(err){
        console.log(err);

    }
    //not found
    if(!shippers){
        return res.status(404).json({message:"Shipment provider not found"});

    }

    //display all users
    return res.status(200).json({shippers});

};


//data insert
const addShippers = async(req,res,next) =>{

    const{providerid,companyname,companyemail,companyphone,companyaddress,companytype,rateperkg}= req.body;
    let shippers;

    try{
        shippers = new Shippers({
            providerid:providerid,
            companyname:companyname,
            companyemail:companyemail,
            companyphone:companyphone,
            companyaddress:companyaddress,
            companytype:companytype,
            rateperkg:rateperkg});
        await shippers.save();
    }catch(err){
        console.log(err);
    }

    //not insert users
    if(!shippers){
        return res.status(404).json({message:"Unable to add the shipment provider"});

    }

    return res.status(200).json({shippers});

};

//get by id
const getByIdShippers = async (req,res,next) =>{
    const shipperid = req.params.shipperid;
    console.log("Shipper ID recieved",shipperid,typeof shipperid);  
    let shippers;
    
    try{
        shippers = await Shippers.findById(shipperid);
    }catch(err){
        console.log(err);

    }

    //not insert users
    if(!shippers){
        return res.status(404).json({message:"Shipment provider not found"});

    }

    return res.status(200).json({shippers});
};



//update user details
const updateShippers = async(req,res,next)=>{

    const shipperid = req.params.shipperid;
    const{providerid,companyname,companyemail,companyphone,companyaddress,companytype,rateperkg}= req.body;

    let shippers;

    try{
        
        shippers= await Shippers.findByIdAndUpdate(shipperid,
        
            {providerid:providerid,
                companyname:companyname,
                companyemail:companyemail,
                companyphone:companyphone,
                companyaddress:companyaddress,
                companytype:companytype,
                rateperkg:rateperkg });
            shippers = await shippers.save();
    }catch(err){
        console.log(err);
    }

     //not insert users
     if(!shippers){
        return res.status(404).json({message:"unable to update user details"});

    }

    return res.status(200).json({shippers});

};


//delete user details

const deleteShippers = async(req,res,next)=>{

    const shipperid = req.params.shipperid;

    //create variable
    let shippers;

    try{
        shippers = await Shippers.findByIdAndDelete(shipperid)
    }catch(err){
        console.log(err);
    }

    if(!shippers){
        return res.status(404).json({message:"unable to delete "});

    }

    return res.status(200).json({shippers});



};


exports.getAllShippers = getAllShippers;
exports.addShippers = addShippers;
exports.getByIdShippers = getByIdShippers;
exports.updateShippers = updateShippers;
exports.deleteShippers = deleteShippers;
*/