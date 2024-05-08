# HexGL ft Fuel

Source code from [HexGL](http://hexgl.bkcore.com), the futuristic HTML5 racing game by [Thibaut Despoulain](http://bkcore.com)

The app is built on three.js r53, download the source [https://github.com/mrdoob/three.js/releases/tag/r53](https://github.com/mrdoob/three.js/releases/tag/r53) and run docs locally.

## Running

```sh
npm i  
npm i --force

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

## Fuel
[Migrate to TS, Good](https://www.useanvil.com/blog/engineering/converting-vanilla-javascript-to-typescript/)  
[Migrate to TS small](https://www.optimum-web.com/can-you-use-typescript-and-javascript-together-how-to-combine-the-two/)  

```npm install fuels --save-dev```  
```npm install typescript --save-dev```  
```touch tsconfig.json``` Create if it doesn't exist, then follow Good tutorial  
[tsconfig.json example](https://gist.githubusercontent.com/ryanatkn/f1793abbe020e08b785cb56d4a712af1/raw/15e537cd0ead24765e5a92d93d7f06b2dff688cd/tsconfig.json)  
  
1. Create a ```NewFile.tsx``` somewhere (in ```/fuel``` folder)

    1.1 and import it in ```index.html``` ```<script type="module" src="dist/NewFile.js"></script>```  

2. ```npx tsc``` [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html) Compile  and look in the ```/dist``` folder  
``` npm run tsbuild , npm run wpbuild, npm start ```  
  
  "scripts": { 
    "dev": "run-p serve live-reload", 
    "build": "webpack --config webpack.config.js",
     "start": "run-p serve live-reload", 
     "tsbuild": "tsc -p tsconfig.json",
      "wpbuild": "webpack", 
      "dev:coffee": "run-p compile:watch serve", 
      "serve": "http-server ./ -p 8080",
       "live-reload": "browser-sync start --proxy "127.0.0.1:8080" --files "."", "compile": "coffee -c .", "compile:watch": "coffee --watch -c ." },