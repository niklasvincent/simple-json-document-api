# simple-json-document-api
Useful for mocking things requiring a back-end. Will persist data to disk.

Written in [NodeJS](https://nodejs.org/en/).

## Getting started

Install dependencies using [npm](https://www.npmjs.com/):

    npm install

Start application:

    npm start

Example output:

    > simple-json-document-api@0.0.1 start /Users/nlindblad/Play/simple-json-document-api
    > node server.js

    simple-json-api listening at http://0.0.0.0:10000

### How to connect

By default the application will listen on all available network interfaces (binding to `0.0.0.0`). Just find your IP on the local network (`ifconfig`, Network Manager, etc.) and use that if you want to connect from other devices.

For local connections, simply use `127.0.0.1`.

## HTTP API

Everything is stored by key.

### Adding/updating content

    curl -XPOST http://127.0.0.1:10000/content/my-key -d '{ "some": "data" }'

### Retrieving content

    curl -XGET http://127.0.0.1:10000/content/my-key

Result:

    { "some": "data" }