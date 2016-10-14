# deliverydotcom
A Node client for Delivery.com

## Usage

``
var deilverydotcom = require('deliverydotcom');
deliverydotcom.setConfig(require('./config.js'));
``

Where config.js is a file of the following format:

``module.exports = {
    API_URL : "http://sandbox.delivery.com",
    OAUTH_TOKEN : "c9IiXZotrk9p6TBVcJtQYeOo9loYYwt8Z0He7yWm",
    CREDIT_CARD_ID: 2079
    DELIVERY_TIP: 2.0,
    MAX_SEARCH_RADIUS: 3200, //meters
    CLIENT_ID: 'YTcxNTYzMmRiYmNiZTFiY2E2ZTNjYzFmMGU1NjJiMGIx',
    CLIENT_SECRET: 'lvJSeFdoR4gkL9sybAhK22DTtCAAdmUExI1FIZzK',
    DEBUG: true
}``

If DEBUG is set to ``true``, the module will not actually add an item to a cart or execute checkout, instead returning an object with ``order_id == 1``. This is to allow you to debug in light of delivery.com deprecating their sandbox API.  