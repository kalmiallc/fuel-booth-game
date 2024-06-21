# Fuel Game

Source code from [HexGL](http://hexgl.bkcore.com), the futuristic HTML5 racing game by [Thibaut Despoulain](http://bkcore.com)

The app is built on three.js r53, download the source [https://github.com/mrdoob/three.js/releases/tag/r53](https://github.com/mrdoob/three.js/releases/tag/r53) and run docs locally.

### Requirements

- node version 18+
- running fuel-api on localhost port 3002

## Setup

In `fuel/Transaction.js` you can set `API_SCORE_URL` to the URL where the API is running.

## Running

```sh
npm i
npm i --force

# dev (serve with browser refresh on file change)
npm run dev

# if changing coffeescript
npm run compile

# just serve
npm run serve
```
