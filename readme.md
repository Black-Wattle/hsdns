# HSDNS CLI

This is a simple application cli application that you can use to interface with a HSDNS server. 

### Features:

The CLI allows you to do the following:

- Connect to a hsdns-server
- Simple authentication
- Simple verification of Zone ownership
- Add or Remove HSD Zones on the server
- Add or Remove DNS records for HSD Zones

## Getting started:

### Prerequisites:

- NodeJS 10<
- NPM

### Installation

**via NPM**

The easiest way to setup the CLI is to use NPM. Run the following command to get started:

```
npm install -g hsdns

hsdns 
```
The cli is now setup and ready to go!

**From the source**

You can also build this from source and modify the default server from the get go. To run from source use the following commands:

```
git clone https://github.com/Black-Wattle/hsdns

cd hsdns

npm i

npm link

hsdns
```
This code sets up an `npm link` to the local directory you've just setup. You can now modify the cli and also use `hsdns` simultaneously.

### Issues

If you hit a snag, please create an issue above.

## Author

lewi 🥔

[info@blackwattle.ad](mailto:info@blackwattle.ad)

`hs1qe2yqlqnrycg24uaw45gkefnqzwc9s0pxfer22l`




