# BigBlueButton API JS

[![BigBlueButtonJs Logo](https://bigbluebutton.network/images/logo.png)](https://bigbluebutton.network)

JavaScript layer to interact with BigBlueButton [API](https://docs.bigbluebutton.org/dev/api). Supports [WebHooks](https://docs.bigbluebutton.org/dev/webhooks.html).

## [Read the Official Documentation](https://bigbluebutton.network/)

## Features

- Supports BBB API, and WebHooks
- Provides methods to construct URLs, and calculate SHA checksum
- Provides HTTP client that converts XML responses to JS objects
- Works with Node 10 or newer

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
// Create an API object passing the url, the salt and the mobile salt
const BigBlueButtonApi = require("bigbluebutton-api-js")
const api = new bbb.api(
  "https://your-bigbluebutton-server.com/bigbluebutton/api", 
  "8cd8ef52e8e101574e400365b55e11a6",
  "03b07",
);

// A hash of parameters.
// The parameter names are the same names BigBlueButton expects to receive in the API calls. The lib will make sure that, for each API call, only the parameters it support will be used.
const params = {
  name: "random-9998650"
  meetingID: "random-9998650"
  moderatorPW: "mp"
  attendeePW: "ap"
  welcome: "<br>Welcome to <b>%%CONFNAME%%</b>!"
  attendeePW: "ap"
  fullName: "User 8584148"
  meetingID: "random-9998650"
  moderatorPW: "mp"
  password: "mp"
  publish: false
  random: "416074726"
  record: false
  recordID: "random-9998650"
  voiceBridge: "75858"
}

// Than call the `getUrls` function
api.getUrls(params)

// Will return an object with all URLs, similar to:
{
    create: "https://your-bigbluebutton-server.com/bigbluebutton/api/create?name=random-266119&meetingID=random-266119&moderatorPW=mp&attendeePW=ap&welcome=%3Cbr%3EWelcome%20to%20%3Cb%3E%25%25CONFNAME%25%25%3C%2Fb%3E!&voiceBridge=76262&record=false&checksum=6c529b6e31fbce9668fd66d99a09da7a78f4",
    end: "https://your-bigbluebutton-server.com/bigbluebutton/api/end?meetingID=random-266119&password=mp&checksum=4f0df85832063a4606786a8f4207a6629fcc",
    getMeetings: "https://your-bigbluebutton-server.com/bigbluebutton/api/getMeetings?random=446147049&checksum=94ba109ea7348ea7d89239855812fdd7bdaf"
    ...
}

```

## License

Distributed under The MIT License (MIT), see `LICENSE`.