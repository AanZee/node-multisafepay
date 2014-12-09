'use-strict';

/** Dependencies */
var querystring = require('querystring'),
    request = require('request'),
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
    returnType: 'object'
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
        throw err;
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
  '<gateways ua="node-multisafepay-0.1.0">'+
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
  '<idealissuers ua="node-multisafepay-0.1.0">'+
    '<merchant>'+
      '<account>'+this.options.account+'</account>'+
      '<site_id>'+this.options.site_id+'</site_id>'+
      '<site_secure_code>'+this.options.site_secure_code+'</site_secure_code>'+
    '</merchant>'+
  '</idealissuers>';

  this.post(body, callback);
};

