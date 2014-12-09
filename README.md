node-multisafepay
=================

Node.js wrapper for the MultiSafePay Connect API

## Disclaimer

This is still under (huge) construction. Only some functions are available, the rest will follow asap.

# Install

```bash
npm install multisafepay
```
# Usage 

```javascript
var multisafepay = require('multisafepay');
var client = api.createClient({
	account: '12345678', 
	site_id: '12345', 
	site_secure_code: '123456'
});


// Get available payment gateways
client.gateways('nl', 'nl_NL', function(data) {
  console.log(data); // Contains an array with gateways
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

