# BigBlueButton API JS

[![BigBlueButtonJs Logo](https://bigbluebutton.network/images/logo.png)](https://bigbluebutton.network)

JavaScript layer to interact with BigBlueButton [API](https://docs.bigbluebutton.org/dev/api). Supports [WebHooks](https://docs.bigbluebutton.org/dev/webhooks.html).

## [Read the Official Documentation](https://bigbluebutton.network/)

## Features

- Supports BBB API, and WebHooks
- Provides methods to construct URLs, and calculate SHA checksum
- Provides HTTP client that converts XML responses to JS objects
- Works with Node 10 or newer
- Works in browser [`dist/browser.js`](https://github.com/aakatev/bigbluebutton-js/tree/master/dist/browser.js)

## Installation

```bash
npm i -s bigbluebutton-api-js
```

## Usage

You will need to provide BigBlueButton URL and secret to the script. You can obtain them by logging into you BBB server, and running:

```bash
bbb-conf --secret
```

Use the obtained values in your script:

```javascript
const bbb = require('bigbluebutton-api-js')
let api = bbb.api(
    process.env.BBB_URL, 
    process.env.BBB_SECRET
  )
```
## Development

At first install [Node.js](http://nodejs.org/), see `package.json` for
the specific version required.

Install the dependencies with:

    npm install -d

Then, to compile the coffee files into javascript, run:

    cake build

This will compile all `*.coffee` files in `/src` to javascript files
in `/lib`.

To watch for changes and compile the files automatically run:

    cake watch

## License

Distributed under The MIT License (MIT), see `LICENSE`.