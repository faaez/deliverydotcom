var request = require('request');   
var config =  null;//require('./config.js')
var qs = require('querystring');

var deliverydotcom = {
    setConfig: function(_config){
        config = _config;
    },
    searchDelivery: function(params,callback){
        var options = {url:config.API_URL+'/merchant/search/delivery?'+qs.stringify(params),headers:{'Authorization':config.OAUTH_TOKEN}};
        console.log(options.url);
        request(options, function(err,response,body){
            if(err) {
                console.log(err);
            }
            callback(body);
        });
    },
    merchantInfo: function(merchantId,callback){
        var options = {
            method:'GET',
            url:config.API_URL+'/merchant/'+merchantId,
            headers:{'Authorization':config.OAUTH_TOKEN}
        };
        request(options,function(err,response,body){
            if(err){
                console.log(err);
            }
            try {
              callback(JSON.parse(body));
            } catch(err) {
              console.log(err);
              callback({});
            }
            
        });
    },
    merchantMenu: function(merchantId,callback){
        var options = {
            method:'GET',
            url:config.API_URL+'/merchant/'+merchantId+'/menu?client_id='+config.CLIENT_ID
        };
        request(options,function(err,response,body){
            if(err){
                console.log(err);
            }
            callback(body);
        });

    },
    merchantHours: function(merchantId,callback){
        var options = {
            method:'GET',
            url:config.API_URL+'/merchant/'+merchantId+'/hours?client_id='+config.CLIENT_ID
        };
        request(options,function(err,response,body){
            if(err){
                console.log(err);
            }
            callback(JSON.parse(body));
        });
    },
    getProductInfo: function(productId,merchantId,callback) {
        var options = {
            method:'GET',
            url:config.API_URL+'/merchant/'+merchantId+'/menu/'+productId+'?client_id='+config.CLIENT_ID
        };
        request(options,function(err,response,body){
            if(err){
                console.log(err);
            } try {
              callback(JSON.parse(body));
            } catch(err) {
              console.log(err);
              callback({});
            }
            
        });
    },
    addItemToCart: function(merchantId,productId,quantity,instructions,callback) {
        console.log(config.API_URL+'/customer/cart/'+merchantId);
        var body = {
              "order_type": "delivery",
              "instructions": instructions,
              "item": {
                "item_id": productId,
                "item_qty": quantity
              }
            };
        if (config.DEBUG) {
          callback("DEBUG: fake add item to card");
          return;
        }
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
            console.log(response.status);
            callback(body);
        });
    },
    emptyCart: function(merchantId,callback) {
        var options = {
            method:'DELETE',
            url:config.API_URL+'/customer/cart/'+merchantId,
            headers:{'Authorization':config.OAUTH_TOKEN},
        };
        request(options, function(err,response,body){
            if (err) {
                console.log(err);
            }
            console.log('cart emptied');
            callback(body);
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
    addAddress: function(street,city,state,zipcode,phone,unit_number,cross_streets,company,callback) {
        if (!street || !city || !state || !zipcode || !phone) {
            return "missing parameters"
        }
        var body = {
            street: street,
            city: city,
            state: state,
            zip_code: zipcode,
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

            callback(body);
        });
    },
    checkout: function(merchantId,location_id,pickup,instructions,callback) {
        if(config.DEBUG) {
          callback({order_id:1});
          return;
        }
        var body = {
          "tip": config.DELIVERY_TIP ? config.DELIVERY_TIP : 0.0,
          "uhau_id" : config.UHAU_ID ? config.UHAU_ID : 12345,
          "instructions": instructions,
          "payments": [
            {
              "type": "credit_card",
              "id": config.CREDIT_CARD_ID
            }
          ],
          "order_type": pickup ? "pickup":"delivery",
          "order_time": new Date().toISOString(),
          "sms_notify": false
        };
        if(location_id) {
          body.location_id = location_id;
        }

        var options = {
            method:'POST',
            url:config.API_URL+'/customer/cart/'+merchantId+'/checkout',
            timeout: 30000,
            headers:{'Authorization':config.OAUTH_TOKEN},
            json: body
        };
        // callback({order_id:1})
        request(options, function(err,response,body){
            if(err) {
                console.log(err);
            }
            callback(body);
        });
    }
}

module.exports = deliverydotcom;