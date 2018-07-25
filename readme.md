# @absolunet/library-builder

[![npm](https://img.shields.io/npm/v/@absolunet/library-builder.svg)](https://www.npmjs.com/package/@absolunet/library-builder)
[![npm dependencies](https://david-dm.org/absolunet/node-library-builder/status.svg)](https://david-dm.org/absolunet/node-library-builder)
[![npms](https://badges.npms.io/%40absolunet%2Flibrary-builder.svg)](https://npms.io/search?q=%40absolunet%2Flibrary-builder)
[![Travis CI](https://api.travis-ci.org/absolunet/node-library-builder.svg?branch=master)](https://travis-ci.org/absolunet/node-library-builder/builds)
[![Code style ESLint](https://img.shields.io/badge/code_style-@absolunet/node-659d32.svg)](https://github.com/absolunet/eslint-config-node)

> JS library builder via webpack

Write your JS library and export it for Node.js, web (ES5/ES6) via [webpack](https://webpack.js.org) and [Babel](https://babeljs.io/)


## Install

```sh
$ npm install @absolunet/library-builder
```


## Usage

Imposes some conventions to work well

### Project structure
```
dist/
	↳ node.js
	↳ web.js
	↳ web-es5.js

src/
	↳ index.js
	↳ libs/
	↳ wrapper/
		↳ node.js
		↳ web.js
```

- Each build will be outputted in a `dist` folder with a predefined name.
- Entry points for the builds are under a `src/wrapper` folder with predefined names.
- *Ideally* the main script would be under `src/index.js` with its subfiles under `src/libs`.


### Code conventions
- Internal dependencies (which will be outputted in the final built file) are dealt with the `ES6 modules (import / export)` syntax.
- External dependencies (which will be referenced in the final built file) are dealt with the `Node.js modules (require)` syntax.
- `src/index.js` should end with an `export default` statement representing the whole library.


### Node.js build
- External dependencies will be left untouched in the final built file thus making classic `require()` Node.js statements. *(See webpack configuration)*
- The `src/wrapper/node.js` file should look like this:
```js
export { default as mylibrary } from '../index.js';
```
- Making its final usage look like
```js
const { mylibrary } = require('@organisation/my-library');   // dist/node.js
```


### Web build
- External dependencies will be transform to a variable assignation, assuming that the dependencies are already loaded elsewhere. *(See webpack configuration)*
```js
const cl = require('cool-lib');
// Becomes
const cl = coolLib;
```
- The `src/wrapper/web.js` file should look like this:
```js
import all from '../index.js';
window.mylibrary = all;
```
- Making its final usage look like
```js
console.log(window.mylibrary);
```
- The `dist/web.js` is a pure built and the `dist/web-es5.js` is the same but with a Babel compilation to ES5 syntax.


### webpack Configuration
Your `webpack.config.js` should look like this
```js
const merge          = require('lodash.merge');
const libraryBuilder = require('@absolunet/library-builder');

libraryBuilder.setRoot(__dirname);


//-- Node.js
const nodeConfig = merge({}, libraryBuilder.config.node, {
	externals: [
		'cool-lib',          // Dependencies to reference and not include
		'meaningful-helper'
	]
});


//-- Web
const webExternals = {
	externals: {
		'cool-lib':           'coolLib',   // Dependencies to reference and their variable counterpart
		'meaningful-helper':  'mnfHelper'
	}
};

const webConfig    = merge({}, libraryBuilder.config.web,    webExternals);
const webES5Config = merge({}, libraryBuilder.config.webES5, webExternals);


module.exports = [nodeConfig, webConfig, webES5Config];
```


### package.json
Your `package.json` should contain these entries
```json
{
	"main": "dist/node.js",
	"scripts": {
		"build": "node node_modules/@absolunet/library-builder/bin/build.js"
	},
	"devDependencies": {
		"@absolunet/library-builder": "0.0.1",
		"lodash.merge": "4.6.1"
	},
	"dependencies": {
		"cool-lib": "^1.2.3",
		"meaningful-helper": "^4.5.6"
	}
}
```

This way to build you only need to run `npm run build`



<br>
<br>

## API

### `setRoot(path)`
Set the root path of your project

#### path
Type: `string`<br>
Path to root folder  *(typically `__dirname`)*


<br>




## API - Configuration

### `config.node`
Base webpack config for Node.js export




<br>

### `config.web`
Base webpack config for web ES6 export




<br>

### `config.webES5`
Base webpack config for web ES5 export (via Babel)






<br>
<br>

## License

MIT © [Absolunet](https://absolunet.com)
