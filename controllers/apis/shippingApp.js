const Constants 		= require('../../constants/constants');
//const Cart   = require('../../models/cart');
//const Product   = require('../../models/product');
//const Color   = require('../../models/color');
//const AttributOption   = require('../../models/attributeOption');
//const Attribut   = require('../../models/attribute');
//const async = require('async');


exports.getShppingRate = (req,res) => {
    //if(req.body.device_token !== ''){
        console.log('ok');
        
        var upsAPI = require('shipping-ups');
 
        var ups = new upsAPI({
            environment: 'sandbox', // or live 
            username: 'siteops@etiqett',
            password: 'XMm{a+7ad^BMcj7e',
            access_key: '1D151DB255A031A8',
            imperial: true, // for inches/lbs, false for metric cm/kgs
            currency: 'USD',
            pretty: false,
            user_agent: 'uh-sem-blee, Co | typefoo',
            debug: true
        });

        
        
        
        
        data = {
            pickup_type: 'daily_pickup', // optional, can be: 'daily_pickup', 'customer_counter', 'one_time_pickup', 'on_call_air', 'suggested_retail_rates', 'letter_center', 'air_service_center'
            pickup_type_code: '02', // optional, overwrites pickup_type
            customer_classification: '00', // optional, need more details about what this does
            shipper: {
                name: 'Type Foo',
                shipper_number: 'SHIPPER_NUMBER', // optional, but recommended for accurate rating
                phone_number: '', // optional
                fax_number: '', // optional
                email_address: '', // optional
                tax_identification_number: '', // optional
                address: {
                  address_line_1: '123 Fake Address',
                  city: 'Dover',
                  state_code: 'OH',
                  country_code: 'US',
                  postal_code: '44622'
                }
            },
            ship_to: {
                company_name: 'Company Name', // or person's name
                attention_name: '', // optional
                phone_number: '', // optional
                fax_number: '', // optional
                email_address: '', // optional
                tax_identification_number: '', // optional
                location_id: '', //optional, for specific locations
                address: {
                    address_line_1: '3456 Fake Address', // optional
                    city: 'Charlotte', // optional
                    state_code: 'NC', // optional, required for negotiated rates
                    country_code: 'US',
                    postal_code: '28205',
                    residential: true // optional, can be useful for accurate rating
                }
            },
            ship_from: { // optional, use if different from shipper address
                company_name: 'Company Name', // or person's name
                attention_name: 'Attention Name',
                phone_number: '', // optional
                tax_identification_number: '', // optional
                address: {
                    address_line_1: '123 Fake Address',
                    city: 'Dover',
                    state_code: 'OH',
                    country_code: 'US',
                    postal_code: '44622'
                }
            },
            sold_to: { // optional, The person or company who imports and pays any duties due on the current shipment, required if Invoice of NAFTA CO is requested
                option: '01', // optional, applies to NAFTA CO form
                company_name: 'Company Name', // or person's name
                attention_name: 'Attention Name',
                phone_number: '', // optional
                tax_identification_number: '', // optional
                address: {
                    address_line_1: '123 Fake Address',
                    city: 'Dover',
                    state_code: 'OH',
                    country_code: 'US',
                    postal_code: '44622'
                }
            },
            service: '03', // optional, will rate this specific service.
            services: [ // optional, you can specify which rates to look for -- performs multiple requests, so be careful not to do too many
              '03'
            ],
            return_service: '9', // optional, will provide a UPS Return Service specification
            packages: [
                {
                    packaging_type: '02', // optional, packaging type code
                    weight: 10,
                    description: 'My Package', // optional
                    delivery_confirmation_type: 2, // optional, 1 or 2
                    insured_value: 1000.00, // optional, 2 decimals
                    dimensions: { // optional, integers: 0-108 for imperial, 0-270 for metric
                        length: 12,
                        width: 12,
                        height: 24
                    }
                }
            ]
        }

        options = {
            negotiated_rates: true // Optional, but if truthy then the NegotiatedRatesIndicator will always be placed (even without state/province code). Useful for countries without provinces.
        }
        ups.rates(data,options, function(err, result) {
            console.log('error');
            console.log(err);
            console.log('result');
            console.log(result);
            return res.send({status:'success',msg:result});

        });

        /*Cart.remove({_id:req.body.id, user_id: req.body.user_id},function(error,deleteProduct){
            if(error){
                return res.send({status:'error',msg:error});
            }else{
                return res.send({status:'success',msg:'Product removed from cart.'});
            }
        });
        */
    /*}else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }*/
};
