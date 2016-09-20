/* Add Card Model */
const Card		= require('../../models/card');
 
/* Get the list of all card name with information */

exports.listOfCards = (req, res) => {

		Card.find({user_id:req.params.userId},function(error,getAllCards)
		{
			if(getAllCards)
			{
				return res.json({status:'success',msg:'Found your all Cards.',data:getAllCards});
			}
			else 
			{
				return res.json({status:'success',msg:'You are not stored any Card details.'});
			}
		});	
};

/* Save Card Information */
exports.saveCard = (req,res) => {

	if(req.body.device_token)
	{
        var cardIns 			= new Card();
        cardIns.user_id 		= req.body.user_id;
        cardIns.card_name 		= req.body.card_name;
        cardIns.card_number  	= req.body.card_number;
       	cardIns.card_date 		= req.body.card_date;
       	cardIns.card_type 		= req.body.card_type;
       	cardIns.created 		= Date.now();
       	cardIns.updated 		= Date.now();
       	cardIns.save(function(error) 
        {
        	if (error)
        	{
                return res.json({status:'error',msg:error});
        	}
        	else 
        	{
        		return res.json({status:'success',msg:'Successfully Stored.',data:cardIns._id});
        	}
        });
	}
	else 
	{
		return res.json({status:'error',msg:'Device token not found.'});
	}
         
 
};

/* Remove Card */
exports.removeCard = (req,res) => {

	if(req.body.device_token)
	{
		Card.remove({_id:req.body.card_id,user_id:req.body.user_id},function(error,removeCard)
		{
			if(error)
			{
				return res.json({status:'error',msg:error});
			}
			else
			{
				return res.json({status:'success',msg:'Removed Successfully.'});
			}
		});
	}
	else 
	{
		return res.json({status:'error',msg:'Device token not found.'});
	}
};
 
/* Edit Card */
exports.editCard = (req,res) => {
	if(req.body.device_token)
	{
		Card.findOne({_id:req.body.card_id,user_id:req.body.user_id},function(error,fetchCard)
		{
			if(error)
			{
				return res.json({status:'error',msg:error});
			}
			else 
			{
				return res.json({status:'success',msg:'Found details.', data:fetchCard});
			}
		});
	}
	else 
	{
		return res.json({status:'error',msg:'Device token not found.'});
	}	
};

/* Update edit details */
exports.updateCard = (req,res) => {

	if(req.body.device_token)
	{
		updateCardDetails = {
			'card_name' 	: req.body.card_name,
			'card_number' 	: req.body.card_number,
			'card_date'		: req.body.card_date,
		    'card_type'		: req.body.card_type,
		    'updated'		: Date.now() 
		    
		};

		Card.update({_id:req.body.card_id,user_id:req.body.user_id},updateCardDetails, function(error, updateCardDetails)
		{
			if(updateCardDetails)
			{
				return res.json({status:'success',msg:'Update Successfully.'});
			}
			else 
			{
				return res.json({status:'error',msg:error});
			}
		});
	}
	else 
	{
		return res.json({status:'error',msg:'Device token not found.'});
	}		
 
};