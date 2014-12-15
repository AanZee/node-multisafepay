node-multisafepay
=================

Node.js wrapper for the [MultiSafePay Connect API](https://www.multisafepay.com/en/Articles-support-Business/asp-en-php-download-zakelijk.html)

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
For more info about the options / methods, checkout the [API manuals and other examples](https://www.multisafepay.com/en/Articles-support-Business/asp-en-php-download-zakelijk.html).
## Gateways
Retrieves the available payment gateways

```javascript
var country = 'nl';
var locale = 'nl_NL';

client.gateways(country, locale, function(data) {
	var gateways = data.gateways.gateways[0].gateway;

	gateways.forEach(function(gateway) {
		console.log(gateway);
	});
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

## Redirect transaction
Creates a redirect transaction request
```javascript
var options = {
	merchant: {
		notification_url: 'http://www.example.com/notify',
		redirect_url: 'http://www.example.com/thanks',
		cancel_url: 'http://www.example.com/cancel',
		close_window: false
	},
	customer: {
		locale: 'nl_NL',
		ipaddress: '0.0.0.0',
		forwardedip: '1.2.3.4',
		firstname: 'First',
		lastname: 'Name',
		address1: 'Address',
		address2: '',
		housenumber: '123',
		zipcode: '',
		city: '',
		state: '',
		country: 'NL',
		phone: '',
		email: ''
	},
	transaction: {
		id: 'ABC-1234',
		currency: 'EUR',
		amount: '1000',
		description: 'Productname',
		var1: '',
		var2: '',
		var3: '',
		items: '<ul><li>Product</li></ul>',
		manual: false,
		gateway: 'VISA',
		daysactive: ''
	},
	google_analytics: {
		account: 'UA-1234567-8'
	}
};

client.redirecttransaction(options, function(data) {
	console.log(data);
});
```

## Direct transaction
Creates a direct transaction request
```javascript
var options = {
	merchant: {
		notification_url: 'http://www.example.com/notify',
		redirect_url: 'http://www.example.com/thanks',
		cancel_url: 'http://www.example.com/cancel',
		close_window: false
	},
	customer: {
		locale: 'nl_NL',
		ipaddress: '0.0.0.0',
		firstname: 'First',
		lastname: 'Name',
		address1: 'Address',
		address2: '',
		housenumber: '123',
		zipcode: '',
		city: '',
		state: '',
		country: 'NL',
		phone: '',
		email: ''
	},
	transaction: {
		id: 'ABC-1234',
		currency: 'EUR',
		amount: '1000',
		description: 'Productname',
		var1: '',
		var2: '',
		var3: '',
		items: '<ul><li>Product</li></ul>',
		manual: false,
		gateway: 'VISA',
		daysactive: ''
	},
	gatewayInfo: {
		issuerid: '0123'
	}	
	google_analytics: {
		account: 'UA-1234567-8'
	}
};

client.directtransaction(options, function(data) {
	console.log(data);
});
```

## Status
Retrieves status information about a transaction
```javascript
var transactionId = 'ABC-1234';

client.status(transactionId, function(data) {
	console.log(data);
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

