//--------------------------------------------------------
//-- Builder configuration
//--------------------------------------------------------
'use strict';

const merge   = require('lodash.merge');
const webpack = require('webpack');
const __      = require('@absolunet/private-registry');


// Export entry point directory
const EXPORT_PATH = `${__dirname}/export`;


const mergeDist = (self, config) => {
	return merge({}, config, {
		output: {
			path: __(self).get('dist')
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.__PACKAGE_NAME__': JSON.stringify(__(self).get('name')),
				'process.env.__PACKAGE_ROOT__': JSON.stringify(__(self).get('root'))
			})
		]
	});
};






//-- Common
const COMMON_CONFIG = {
	mode:    'none',
	devtool: ''
};


//-- Node.js
const NODE_CONFIG = merge({}, COMMON_CONFIG, {
	target: 'node',
	entry:  `${EXPORT_PATH}/node.js`,
	output: {
		filename:      'node.js',
		libraryTarget: 'commonjs2'
	}
});


//-- kafe
const KAFE_CONFIG = merge({}, COMMON_CONFIG, {
	target: 'web',
	entry:  `${EXPORT_PATH}/kafe.js`,
	output: {
		filename: 'kafe.js'
	}
});


//-- kafe ES5
const KAFE_ES5_CONFIG = merge({}, KAFE_CONFIG, {
	output: {
		filename: 'kafe-es5.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/u,
				exclude: /node_modules/u,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [[
							'@babel/env',
							{
								targets: '> 0.25%, not dead',
								useBuiltIns: 'usage',
								corejs: '3'
							}
						]]
					}
				}
			}
		]
	}

});






//-- Config
class LibraryBuilderConfig {

	constructor(config) {
		__(this).set(config);
	}

	get node() {
		return mergeDist(this, NODE_CONFIG);
	}

	get kafe() {
		return mergeDist(this, KAFE_CONFIG);
	}

	get kafeES5() {
		return mergeDist(this, KAFE_ES5_CONFIG);
	}

}



module.exports = LibraryBuilderConfig;
