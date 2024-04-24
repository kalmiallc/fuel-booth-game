# HexGL ft Fuel

Source code from [HexGL](http://hexgl.bkcore.com), the futuristic HTML5 racing game by [Thibaut Despoulain](http://bkcore.com)

The app is built on three.js r53, download the source [https://github.com/mrdoob/three.js/releases/tag/r53](https://github.com/mrdoob/three.js/releases/tag/r53) and run docs locally.

## Running

```sh
npm i

# dev (serve with broswer refresh on file change)
npm run dev

# if changing coffeescript
npm run compile

# just serve
npm run serve
```

## Info

For importing models `convert_obj_three.py` script from three.js r53 source can be used. (semi-successful for now).

Import scripts in `./index.html`

Fuel customizations in `./fuel`, available in scripts via `window.fuel` or just `fuel`.

_To use full size textures, swap the two textures/ and textures.full/ directories._
