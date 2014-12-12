'use-strict';

/** Dependencies */
var querystring = require('querystring'),
    request = require('request'),
    md5 = require('MD5'),
    parseString = require('xml2js').parseString,
    _ = require('lodash');

/**
 * Client
 * @param  {Object} options  Options object
 * @return {Client}          Returns itself
 */
var Client = function(options) {
  var defaults = {
    account: '',
    site_id: '',
    site_secure_code: '',
    env: 'production',
    returnType: 'object',
    userAgent: 'node-multisafepay-0.1.4'
  };

  this.options = _.merge({}, defaults, options);

  if(this.options.env === 'test') {
    this.url = 'https://testapi.multisafepay.com/ewx/';
  } else {
    this.url = 'https://api.multisafepay.com/ewx/';
  }

  return this;
};

/**
 * Client constuctor
 * @param  {Object} options  Options object
 * @return {Client}          Returns a new instance of the Client object
 */
module.exports.createClient = function(options) {
  return new Client(options);
};

/**
 * Wrapper function for the POST requests
 * @param  {String}   path     Path to the resource
 * @param  {Object}   params   GET parameters
 * @param  {Function} callback Gets called after request is complete
 */
Client.prototype.post = function(body, callback) {
  var _this = this;

  var req = request({
      url: this.url,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
        'Connection': 'close'
      },
      encoding: 'utf-8',
      method: 'POST',
      body: body
    }, function(err, res, data) {
      if(err) {
        res.json(err);
      }

      switch(_this.options.returnType) {
        case 'xml':
          callback(data);
          break;

        case 'object':
          parseString(data, function(err, parseResult) {
            callback(parseResult);
          });
          break;
      }

    }
  );

};

/**
 * Get gateways (payment methods)
 * @param {String} [country] Country shortcode
 * @param {String} [locale] Locale ISO code
 * @param {Function} callback Gets called after request is complete
 */
Client.prototype.gateways = function(country, locale, callback) {
  var body;

  if(typeof country === 'function') {
    callback = country;
    country = null;
  } else if(typeof locale === 'function') {
    callback = locale;
    locale = null;
  }

  body = ''+
  '<?xml version="1.0" encoding="utf-8"?>'+
  '<gateways ua="'+this.options.userAgent+'">'+
    '<merchant>'+
      '<account>'+this.options.account+'</account>'+
      '<site_id>'+this.options.site_id+'</site_id>'+
      '<site_secure_code>'+this.options.site_secure_code+'</site_secure_code>'+
    '</merchant>'+
    '<customer>'+
      (country ? '<country>'+country+'</country>' : '') +
      (locale ? '<locale>'+locale+'</locale>' : '') +
    '</customer>'+
  '</gateways>';

  this.post(body, callback);
};

/**
 * Get iDEAL issuers (list of banks that are supported on the iDEAL gateway)
 * @param {Function} callback Gets called after request is complete
 */
Client.prototype.idealissuers = function(callback) {
  var body;

  body = ''+
  '<?xml version="1.0" encoding="utf-8"?>'+
  '<idealissuers ua="'+this.options.userAgent+'">'+
    '<merchant>'+
      '<account>'+this.options.account+'</account>'+
      '<site_id>'+this.options.site_id+'</site_id>'+
      '<site_secure_code>'+this.options.site_secure_code+'</site_secure_code>'+
    '</merchant>'+
  '</idealissuers>';

  this.post(body, callback);
};

Client.prototype.redirecttransaction = function(attributes, callback) {
  var signature = md5(attributes.transaction.amount + attributes.transaction.currency + this.options.account + this.options.site_id + attributes.transaction.id);
  var body;

  body = ''+
  '<?xml version="1.0" encoding="utf-8"?>'+
  '<redirecttransaction ua="'+this.options.userAgent+'">'+
    '<merchant>'+
      '<account>'+this.options.account+'</account>'+
      '<site_id>'+this.options.site_id+'</site_id>'+
      '<site_secure_code>'+this.options.site_secure_code+'</site_secure_code>'+
      '<notification_url>'+attributes.merchant.notification_url+'</notification_url>'+
      '<redirect_url>'+attributes.merchant.redirect_url+'</redirect_url>'+
      '<cancel_url>'+attributes.merchant.cancel_url+'</cancel_url>'+
      '<close_window>'+attributes.merchant.close_window+'</close_window>'+
    '</merchant>'+
    '<customer>'+
      '<locale>'+attributes.customer.locale+'</locale>'+
      '<ipaddress>'+attributes.customer.ipaddress+'</ipaddress>'+
      '<forwardedip>'+attributes.customer.forwardedip+'</forwardedip>'+
      '<firstname>'+attributes.customer.firstname+'</firstname>'+
      '<lastname>'+attributes.customer.lastname+'</lastname>'+
      '<address1>'+attributes.customer.address1+'</address1>'+
      '<address2>'+attributes.customer.address2+'</address2>'+
      '<housenumber>'+attributes.customer.housenumber+'</housenumber>'+
      '<zipcode>'+attributes.customer.zipcode+'</zipcode>'+
      '<city>'+attributes.customer.city+'</city>'+
      '<state>'+attributes.customer.state+'</state>'+
      '<country>'+attributes.customer.country+'</country>'+
      '<phone>'+attributes.customer.phone+'</phone>'+
      '<email>'+attributes.customer.email+'</email>'+
    '</customer>'+
    '<transaction>'+
      '<id>'+attributes.transaction.id+'</id>'+
      '<currency>'+attributes.transaction.currency+'</currency>'+
      '<amount>'+attributes.transaction.amount+'</amount>'+
      '<description>'+attributes.transaction.description+'</description>'+
      '<var1>'+attributes.transaction.var1+'</var1>'+
      '<var2>'+attributes.transaction.var2+'</var2>'+
      '<var3>'+attributes.transaction.var3+'</var3>'+
      '<items>'+attributes.transaction.items+'</items>'+
      '<manual>'+attributes.transaction.manual+'</manual>'+
      '<gateway>'+attributes.transaction.gateway+'</gateway>'+
      '<daysactive>'+attributes.transaction.daysactive+'</daysactive>'+
    '</transaction>'+
    '<google_analytics>'+
      '<account>'+attributes.google_analytics.account+'</account>'+
    '</google_analytics>'+
    '<signature>'+(attributes.signature || signature)+'</signature>'+
  '</redirecttransaction>';

  this.post(body, callback);
};

Client.prototype.directtransaction = function(attributes, callback) {
  var signature = md5(attributes.transaction.amount + attributes.transaction.currency + this.options.account + this.options.site_id + attributes.transaction.id);
  var gatewayInfo = '';
  var body;

  if('gatewayinfo' in attributes) {
    gatewayInfo += '<gatewayinfo>';

      if('issuerid' in attributes) {
        gatewayInfo += '<issuerid>'+attributes.gatewayinfo.issuerid+'</issuerid>';
      }

      if('accountid' in attributes) {
        gatewayInfo += ''+
        '<accountid>'+attributes.gatewayinfo.accountid+'</accountid>'+
        '<accountholdername>'+attributes.gatewayinfo.accountholdername+'</accountholdername>'+
        '<accountholdercity>'+attributes.gatewayinfo.accountholdercity+'</accountholdercity>'+
        '<accountholdercountry>'+attributes.gatewayinfo.accountholdercountry+'</accountholdercountry>'+
        '<accountholderiban>'+attributes.gatewayinfo.accountholderiban+'</accountholderiban>'+
        '<accountholderbic>'+attributes.gatewayinfo.accountholderbic+'</accountholderbic>';
      }

    gatewayInfo += '</gatewayinfo>';
  }

  body = ''+
  '<?xml version="1.0" encoding="utf-8"?>'+
  '<directtransaction ua="'+this.options.userAgent+'">'+
    '<merchant>'+
      '<account>'+this.options.account+'</account>'+
      '<site_id>'+this.options.site_id+'</site_id>'+
      '<site_secure_code>'+this.options.site_secure_code+'</site_secure_code>'+
      '<notification_url>'+attributes.merchant.notification_url+'</notification_url>'+
      '<redirect_url>'+attributes.merchant.redirect_url+'</redirect_url>'+
      '<cancel_url>'+attributes.merchant.cancel_url+'</cancel_url>'+
      '<close_window>'+attributes.merchant.close_window+'</close_window>'+
    '</merchant>'+
    '<customer>'+
      '<locale>'+attributes.customer.locale+'</locale>'+
      '<ipaddress>'+attributes.customer.ipaddress+'</ipaddress>'+
      '<firstname>'+attributes.customer.firstname+'</firstname>'+
      '<lastname>'+attributes.customer.lastname+'</lastname>'+
      '<address1>'+attributes.customer.address1+'</address1>'+
      '<address2>'+attributes.customer.address2+'</address2>'+
      '<housenumber>'+attributes.customer.housenumber+'</housenumber>'+
      '<zipcode>'+attributes.customer.zipcode+'</zipcode>'+
      '<city>'+attributes.customer.city+'</city>'+
      '<state>'+attributes.customer.state+'</state>'+
      '<country>'+attributes.customer.country+'</country>'+
      '<phone>'+attributes.customer.phone+'</phone>'+
      '<email>'+attributes.customer.email+'</email>'+
    '</customer>'+
    '<transaction>'+
      '<id>'+attributes.transaction.id+'</id>'+
      '<currency>'+attributes.transaction.currency+'</currency>'+
      '<amount>'+attributes.transaction.amount+'</amount>'+
      '<description>'+attributes.transaction.description+'</description>'+
      '<var1>'+attributes.transaction.var1+'</var1>'+
      '<var2>'+attributes.transaction.var2+'</var2>'+
      '<var3>'+attributes.transaction.var3+'</var3>'+
      '<items>'+attributes.transaction.items+'</items>'+
      '<manual>'+attributes.transaction.manual+'</manual>'+
      '<gateway>'+attributes.transaction.gateway+'</gateway>'+
      '<daysactive>'+attributes.transaction.daysactive+'</daysactive>'+
    '</transaction>'+
    gatewayInfo +
    '<google_analytics>'+
      '<account>'+attributes.google_analytics.account+'</account>'+
    '</google_analytics>'+
    '<signature>'+(attributes.signature || signature)+'</signature>'+
  '</directtransaction>';

  this.post(body, callback);
};