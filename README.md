node-multisafepay
=================

Node.js wrapper for the MultiSafePay Connect API

### Disclaimer

Not all methods are available yet. Feel free to add them and send in a pull request

# Install

```bash
npm install multisafepay
```
# Usage 

Create a client
```javascript
var multisafepay = require('multisafepay');
var client = api.createClient({
	account: '12345678', // (required) The account ID you receive from MultiSafePay
	site_id: '12345', // (required) The site ID you get when creating a site in the MultiSafePay client area
	site_secure_code: '123456', // (required) The Site Secure Code that belongs to the site you created
	env: 'production', // (optional) The API environment, can be 'production' or 'test'
	returnType: 'object', // (optional) The type of the return data. By default, a JS object is returned, but it can also be set to 'xml'
	userAgent: 'node-multisafepay' // (optional) The User Agent that is sent with every request
});
```
The client can be used to call methods on the MultiSafePay API
```javascript
// Get available payment gateways
client.gateways('nl', 'nl_NL', function(data) {
  console.log(data); // Contains an array with gateways
});
```

# Methods

## Gateways
Retrieves the available payment gateways

```javascript
var country = 'nl';
var locale = 'nl_NL';

client.gateways(country, locale, function(data) {
	var objGroups = {};
	var gateways = data.gateways.gateways[0].gateway;
	var groups = req.app.get('multisafepay_groups');

	_.map(groups, function(group, key) {
		objGroups[key] = {
			label: res.__('payment.method.' + key),
			systemname: key,
			methods: []
		};
	});

	gateways.forEach(function(gateway) {
		var setGroup;
		var systemname = gateway.id[0].toLowerCase();

		_.map(groups, function(group, key) {
			group.forEach(function(child) {
				if(child === systemname) {
					setGroup = key;
				}
			});
		});

		if(setGroup) {
			objGroups[setGroup].methods.push({
				systemname: systemname,
				label: gateway.description[0]
			});
		}
	});

	console.log('Saving iDEAL banks to Redis cache');

	redisClient.set(redisKey, JSON.stringify(objGroups));		

	res.json(objGroups);
});
```

## iDEAL issuers
Retrieves the available iDEAL issuers
```javascript
client.idealissuers(function(data) {
	var issuers = data.idealissuers.issuers[0].issuer;
	
	issuers.forEach(function(issuer) {
		console.log(issuer);
	});

});
```

# Support
Found a bug? Have a great idea? Feel free to create an issue or a pull request!

# License

The MIT License (MIT)

Copyright (c) 2014 Aan Zee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

