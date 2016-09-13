<<<<<<< Updated upstream
const Constants         = require('../../constants/constants');
=======
const Constants 		= require('../../constants/constants');
>>>>>>> Stashed changes


exports.getShppingRate = (req,res) => {
    if(req.body.device_token !== ''){
        var upsAPI = require('shipping-ups');
 
        var ups = new upsAPI({
            environment: 'sandbox', // or live 
            username: 'siteops@etiqett',
            password: 'XMm{a+7ad^BMcj7e',
            access_key: '1D151DB255A031A8',
            imperial: true, // for inches/lbs, false for metric cm/kgs
            currency: 'USD',
            pretty: false,
            //user_agent: 'uh-sem-blee, Co | typefoo',
            debug: true
        });

        var codeAr = {};
        codeAr['11'] = 'Standard';
        codeAr['03'] = 'Ground';
        codeAr['12'] = '3 Day Select';
        codeAr['02'] = '2nd Day Air';
        codeAr['59'] = '2nd Day Air AM';
        codeAr['13'] =  'Next Day Air Saver';
        codeAr['01'] = 'Next Day Air';
        codeAr['14'] = 'Next Day Air Early A.M.';
        codeAr['07'] = 'UPS Worldwide Express';
        codeAr['54'] = 'Worldwide Express Plus';
        codeAr['08'] = 'UPS Worldwide Expedited';
        codeAr['65'] =  'UPS World Wide Saver';
        
        
        
        data = {
            pickup_type: 'daily_pickup', // optional, can be: 'daily_pickup', 'customer_counter', 'one_time_pickup', 'on_call_air', 'suggested_retail_rates', 'letter_center', 'air_service_center'
            //pickup_type_code: '02', // optional, overwrites pickup_type
            customer_classification: '00', // optional, need more details about what this does
            shipper: {
                name: 'LAST RESORT COLLABORATIONS, LLC',
                shipper_number: '', // optional, but recommended for accurate rating
                phone_number: '', // optional
                fax_number: '', // optional
                email_address: '', // optional
                tax_identification_number: '', // optional
                address: {
                  address_line_1: '1439 S RIMHURST AVE',
                  city: 'GLENDORA',
                  state_code: 'CA',
                  country_code: 'US',
                  postal_code: '91740'
                }
            },
            ship_to: {
                company_name: 'Rameshwer', // or person's name
                attention_name: '', // optional
                phone_number: '', // optional
                fax_number: '', // optional
                email_address: '', // optional
                tax_identification_number: '', // optional
                location_id: '', //optional, for specific locations
                address: {
                    address_line_1: '3456 Fake Address', // optional
                    city: 'Barstow', // optional
                    state_code: 'CA', // optional, required for negotiated rates
                    country_code: 'US',
                    postal_code: '92311',
                    residential: true // optional, can be useful for accurate rating
                }
            },
            ship_from: { // optional, use if different from shipper address
                company_name: 'LAST RESORT COLLABORATIONS, LLC', // or person's name
                attention_name: 'LAST RESORT COLLABORATIONS, LLC',
                phone_number: '', // optional
                tax_identification_number: '', // optional
                address: {
                    address_line_1: '1439 S RIMHURST AVE',
                    city: 'GLENDORA',
                    state_code: 'CA',
                    country_code: 'US',
                    postal_code: '91740'
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
                    city: 'Barstow',
                    state_code: 'CA',
                    country_code: 'US',
                    postal_code: '92311'
                }
            },
            /*service: '03', // optional, will rate this specific service.
            services: [ // optional, you can specify which rates to look for -- performs multiple requests, so be careful not to do too many
              '03'
            ],*/
            //return_service: '9', // optional, will provide a UPS Return Service specification
            
            packages: [
                {
                    packaging_type: '02', // optional, packaging type code
                    weight: 1,
                    description: 'My Package', // optional
                    delivery_confirmation_type: 2, // optional, 1 or 2
                    insured_value: 100.00, // optional, 2 decimals
                    dimensions: { // optional, integers: 0-108 for imperial, 0-270 for metric
                        length: 12,
                        width: 12,
                        height: 24
                    }
                }
            ]
        }

        options = {
            //negotiated_rates: false // Optional, but if truthy then the NegotiatedRatesIndicator will always be placed (even without state/province code). Useful for countries without provinces.
        }
        ups.rates(data,options, function(err, result) {
            var mainRes = new Array();
            if(result.Response.ResponseStatusCode == 1){
                for(var i = 0;i < result.RatedShipment.length;i++){
                    var tempRes = {};
                    tempRes.Code = result.RatedShipment[i].Service.Code;
                    tempRes.serviceName = codeAr[result.RatedShipment[i].Service.Code];
                    //tempRes.BillingWeight  = result.RatedShipment[i].BillingWeight.Weight;
                    //tempRes.UnitOfMeasurement  = result.RatedShipment[i].BillingWeight.UnitOfMeasurement.Code;
                    //tempRes.TransportationCharges  = result.RatedShipment[i].TransportationCharges.MonetaryValue;
                    //tempRes.ServiceOptionsCharges  = result.RatedShipment[i].ServiceOptionsCharges.MonetaryValue;
                    tempRes.TotalCharges  = result.RatedShipment[i].TotalCharges.MonetaryValue;
                    mainRes.push(tempRes);
                }
            }
            //console.log(mainRes);
            return res.send({status:'success',msg:'Shiiping Rates are shown in the list',data:mainRes});
        });
    }else{
        return res.json({"status":'error',"msg":'Device Token is not available.'});
    }
};
