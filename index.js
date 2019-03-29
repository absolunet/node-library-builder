//--------------------------------------------------------
//-- Library builder
//--------------------------------------------------------
'use strict';

const merge = require('lodash.merge');
const path  = require('path');


const paths = {};

const mergeDist = (config) => {
	return merge({}, config, {
		output: {
			path: paths.dist
		}
	});
};






//-- Common
const commonConfig = {
	mode:    'none',
	devtool: ''
};


//-- Node.js
const nodeConfig = merge({}, commonConfig, {
	target: 'node',
	entry:  './export/node.js',
	output: {
		filename:      'node.js',
		libraryTarget: 'commonjs2'
	}
});


//-- Browser
const browserConfig = merge({}, commonConfig, {
	target: 'web',
	entry:  './export/browser.js',
	output: {
		filename: 'browser.js'
	}
});


//-- Browser ES5
const browserES5Config = merge({}, browserConfig, {
	output: {
		filename: 'browser-es5.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/u,
				exclude: /node_modules/u,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			}
		]
	}

});






//-- Config
class BuilderConfig {

	get node() {
		return mergeDist(nodeConfig);
	}

	get browser() {
		return mergeDist(browserConfig);
	}

	get browserES5() {
		return mergeDist(browserES5Config);
	}

}


//-- Main
const builderConfig = new BuilderConfig();

class Builder {

	setRoot(root) {
		paths.root = root;
		paths.dist = path.resolve(root, 'dist');
	}

	get config() {
		return builderConfig;
	}

}






module.exports = new Builder();
