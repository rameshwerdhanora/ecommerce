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
        addressIns.firstname        = req.body.firstname;
        addressIns.lastname         = req.body.lastname;
        addressIns.shiptype         = req.body.shiptype;
        addressIns.contact_no       = req.body.contact_no;
        addressIns.address_line1    = req.body.address_line1;
        addressIns.address_line2    = req.body.address_line2;
        addressIns.city             = req.body.city;
        addressIns.postal_code      = req.body.postal_code;
        addressIns.country          = req.body.country;
        addressIns.billmode         = req.body.billmode;
        addressIns.add_type         = req.body.add_type;
        

        addressIns.save(function(error,addressObject)
        {
            if (error)
            {
                return res.json({status:'error',error:err});
            }
            else
            {
                if(req.body.billmode != '1')
                {
                    addressIns.add_type   = 'Billing';
                    addressIns.save(function(error,addressBillObject)
                    {
                        if (error)
                        {
                            return res.json({status:'error',error:err});
                        }
                        else 
                        {
                            return res.json({status:'success',msg:'Address saved successfully',shippingId:addressObject._id,billingId:addressBillObject._id});
                        }
                    });
                }
                else 
                {
                    return res.json({status:'success',msg:'Address saved successfully',addressId:addressObject._id});
                }

                
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

    if(req.body.device_token !== '')
    {
        CustomerAddress.find({ user_id: req.body.user_id,add_type:req.body.add_type}, function(error, availableUserRecord) 
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
            firstname       : req.body.firstname,
            lastname        : req.body.lastname,
            shiptype        : req.body.shiptype,
            contact_no      : req.body.contact_no,
            address_line1   : req.body.address_line1,            
            address_line2   : req.body.address_line2,            
            city            : req.body.city,            
            postal_code     : req.body.postal_code,            
            country         : req.body.country,
            billmode        : req.body.billmode
        }    
 
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
