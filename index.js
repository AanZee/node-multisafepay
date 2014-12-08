'use-strict';

/** Dependencies */
var querystring = require('querystring');
var request = require('request');

/**
 * Client
 * @param  {String} account  MultiSafePay account ID
 * @param  {String} site_id  ID of the site
 * @param  {String} site_secure_code    Access token
 * @return {Client}          Returns itself
 */
var Client = function(account, site_id, site_secure_code, isTest) {
  this.account = account;
  this.site_id = site_id;
  this.site_secure_code = site_secure_code;

  if(isTest) {
    this.url = 'https://testapi.multisafepay.com/ewx/';
  } else {
    this.url = 'https://api.multisafepay.com/ewx/';
  }

  return this;
};

/**
 * Client constuctor
 * @param  {String} account  MultiSafePay account ID
 * @param  {String} site_id  ID of the site
 * @param  {String} site_secure_code    Access token
 * @return {Client}          Returns a new instance of the Client object
 */
module.exports.createClient = function(account, site_id, site_secure_code) {
  return new Client(account, site_id, site_secure_code);
};

/**
 * Wrapper function for the POST requests
 * @param  {String}   path     Path to the resource
 * @param  {Object}   params   GET parameters
 * @param  {Function} callback Gets called after request is complete
 */
Client.prototype.post = function(body, callback) {
  console.log('Posting to ' + this.url);
  var req = request({
      url: this.url,
      headers: {
        'Content-Type': 'text/xml',
        'Content-Length': Buffer.byteLength(body),
        'Connection': 'close'
      },
      method: 'POST',
      body: body
    }, function(err, res, data) {
      if(err) {
        throw err;
      }

      callback(data);
    }
  );

};

/**
 * Get gateways (payment methods)
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
  '<?xml version="1.0" encoding="UTF-8"?>'+
  '<gateways ua="node-multisafepay-0.1.0">'+
    '<merchant>'+
      '<account>'+this.account+'</account>'+
      '<site_id>'+this.site_id+'</site_id>'+
      '<site_secure_code>'+this.site_secure_code+'</site_secure_code>'+
    '</merchant>'+
    '<customer>'+
      (country ? '<country>'+country+'</country>' : '') +
      (locale ? '<locale>'+locale+'</locale>' : '') +
    '</customer>'+
  '</gateways>';

  this.post(body, callback);
};