var request = require('request');   
var config = require('./config.js')
var qs = require('querystring');

var deliverydotcom = {
    searchDelivery: function(params,callback){
        var options = {url:config.API_URL+'merchant/search/delivery?'+qs.stringify(params),headers:{'Authorization':config.OAUTH_TOKEN}};
        console.log(options.url);
        request(options, function(err,response,body){
            if(err) {
                console.log(err);
            }
            console.log(body);
            callback(JSON.parse(body));
        });
    }
}

module.exports = deliverydotcom;