/* Load required library */
const CustomerAddress   = require('../../models/address');

/*
 *Web serive to save user address into database 
 */
exports.addAddress = (req,res) => {

    if(req.body.device_token !== '')
    {
        var addressIns              = new CustomerAddress();
        addressIns.user_id          = req.body.user_id;
        addressIns.address_type     = req.body.addressType;
        addressIns.contact_no1      = req.body.contact_no1;
        addressIns.contact_no2      = req.body.contact_no2;
        addressIns.address_line1    = req.body.address_line1;
        addressIns.address_line2    = req.body.address_line2;
        addressIns.city             = req.body.city;
        addressIns.postal_code      = req.body.postal_code;
        addressIns.country          = req.body.country;

        addressIns.save(function(error,addressObject)
        {
            if (error)
            {
                return res.json({status:'error',error:err});
            }
            else
            {
                return res.json({status:'success',msg:'Address saved successfully',addressId:addressObject._id});
            }
        });
    }
    else
    {
        return res.json({status:'error',msg:'Device token not found.'});
    }
}

/*
 * Web service to send all the user addresses
 */
exports.getUserAddress = (req,res) => {

    if(req.body.device_token !== ''){
        CustomerAddress.find({ user_id: req.body.user_id}, function(error, availableUserRecord) 
        {
            if(availableUserRecord)
            {
                if(availableUserRecord.length){
                    return res.json({status:'success',msg:'','data':availableUserRecord});
                }else{
                    return res.json({status:'success',msg:'No address found'});
                }
            }
            else
            {
                return res.json({status:'error',msg:'No address found'});
            }
        });
    }
    else
    {
        return res.json({status:'error',msg:'Device token not found.'});
    }
}

/* Delete address */
exports.deleteAddress = (req,res) => {
    
    if(req.body.device_token !== '')
    {
         
        CustomerAddress.remove({_id:req.body.addressId,user_id: req.body.user_id},function(error,deleteAddress)
        {
            if(error)
            {
                return res.send({status:'error',msg:error});
            }
            else
            {
                return res.send({status:'success',msg:'Address deleted successfully.'});
            }
        });
    }
    else
    {
        return res.json({status:'error',msg:'Device token not found.'});
    }
};

/*
 *Web serive to save user address into database 
 */
exports.updateAddress = (req,res) => {

    if(req.body.device_token !== '')
    {
        updateAddDetails = 
        {
            address_type    : req.body.addressType,
            contact_no1     : req.body.contact_no1,
            contact_no2     : req.body.contact_no2,            
            address_line1   : req.body.address_line1,            
            address_line2   : req.body.address_line2,            
            city            : req.body.city,            
            postal_code     : req.body.postal_code,            
            country         : req.body.country
        };
         
        CustomerAddress.findByIdAndUpdate(req.body._id,updateAddDetails,function(err,updateRes)
        {
            if (err)
            {
                return res.json({status:'error',error:err});
            }
            else
            {
                return res.json({status:'success',msg:'Address updated successfully'});
            }
        });
    }
    else
    {
        return res.json({status:'error',msg:'Device token not found.'});
    }
}
