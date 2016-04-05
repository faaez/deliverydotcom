var request = require('request');   
var config = null;//require('./config.js')
var qs = require('querystring');

var deliverydotcom = {
    setConfig: function(_config){
        config = _config;
    },
    searchDelivery: function(params,callback){
        var options = {url:config.API_URL+'merchant/search/delivery?'+qs.stringify(params),headers:{'Authorization':config.OAUTH_TOKEN}};
        console.log(options.url);
        request(options, function(err,response,body){
            if(err) {
                console.log(err);
            }
            callback(JSON.parse(body));
        });
    },
    addItemToCart: function(merchantId,productId,quantity,instructions,callback) {
        var body = {
              "order_type": "delivery",
              "instructions": instructions,
              "item": {
                "item_id": productId,
                "item_qty": quantity
              }
            };
        var options = {
            method:'POST',
            url:config.API_URL+'/customer/cart/'+merchantId,
            headers:{'Authorization':config.OAUTH_TOKEN},
            json: body
        };
        request(options, function(err,response,body){
            if(err) {
                console.log(err);
            }
            callback(JSON.parse(body));
        });
    },
    deleteAddress: function(locationId) {
        var options = {
            method:'DELETE',
            url:config.API_URL+'/customer/location/'+locationId,
            headers:{'Authorization':config.OAUTH_TOKEN},
        };
        request(options, function(err,response,body){
            if(err) {
                console.log(err);
            }
            return response.status;
        });
    },
    addAddress: function(street,city,state,zipcode,phone,unit_number,cross_streets,company) {
        if (!street || !city || !state || !zipcode || !phone) {
            return "missing parameters"
        }
        var body = {
            street: street,
            city: city,
            state: state,
            zipcode: zipcode,
            phone: phone
        }
        if (unit_number) {
            body.unit_number = unit_number;
        }
        if (cross_streets) {
            body.cross_streets = cross_streets;
        }
        if (company) {
            body.company = company;
        }
        var options = {
            method:'POST',
            url:config.API_URL+'/customer/location',
            headers:{'Authorization':config.OAUTH_TOKEN},
            json: body
        };
        request(options, function(err,response,body){
            if(err) {
                console.log(err);
            }
            callback(JSON.parse(body));
        });
    },
    checkout: function(merchantId,location_id,instructions,callback) {
        var body = {
          "tip": config.DELIVERY_TIP ? config.DELIVERY_TIP : 0.0,
          "location_id": location_id,
          "uhau_id" : config.UHAU_ID ? config.UHAU_ID : 12345,
          "instructions": instructions,
          "payments": [
            {
              "type": "credit_card",
              "id": config.CREDIT_CARD_ID
            }
          ],
          "order_type": "delivery",
          "order_time": new Date().toISOString(),
          "sms_notify": false
        };

        var options = {
            method:'POST',
            url:config.API_URL+'/customer/cart/'+merchantId+'/checkout',
            headers:{'Authorization':config.OAUTH_TOKEN},
            json: body
        };
        request(options, function(err,response,body){
            if(err) {
                console.log(err);
            }
            callback(JSON.parse(body));
        });
    }
}

module.exports = deliverydotcom;