var deliverydotcom = require('../src/deliverydotcom.js');

deliverydotcom.searchDelivery({address:'117 Varick St',keyword:'budweiser'},function(response){
    console.log(response.merchants[0].matched_items[0])
});