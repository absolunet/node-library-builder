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
	mode: 'none',
	devtool: ''
};


//-- Node.js
const nodeConfig = merge({}, commonConfig, {
	target: 'node',
	entry:  './src/wrapper/node.js',
	output: {
		filename: 'node.js',
		libraryTarget: 'commonjs2'
	}
});


//-- Web
const webConfig = merge({}, commonConfig, {
	target: 'web',
	entry:  './src/wrapper/web.js',
	output: {
		filename: 'web.js'
	}
});


//-- Web ES5
const webES5Config = merge({}, webConfig, {
	output: {
		filename: 'web-es5.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
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

	get web() {
		return mergeDist(webConfig);
	}

	get webES5() {
		return mergeDist(webES5Config);
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
