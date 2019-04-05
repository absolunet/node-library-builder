//--------------------------------------------------------
//-- Builder configuration
//--------------------------------------------------------
'use strict';

const merge   = require('lodash.merge');
const ow      = require('ow');
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


//-- Browser
const BROWSER_CONFIG = merge({}, COMMON_CONFIG, {
	target: 'web',
	entry:  `${EXPORT_PATH}/browser.js`,
	output: {
		filename: 'browser.js'
	}
});


//-- Browser ES5
const BROWSER_ES5_CONFIG = merge({}, BROWSER_CONFIG, {
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


//-- kafe
const KAFE_CONFIG = merge({}, BROWSER_CONFIG, {
	entry:  `${EXPORT_PATH}/kafe.js`,
	output: {
		filename: 'kafe.js'
	}
});


//-- kafe ES5
const KAFE_ES5_CONFIG = merge({}, BROWSER_ES5_CONFIG, {
	entry:  `${EXPORT_PATH}/kafe.js`,
	output: {
		filename: 'kafe-es5.js'
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

	get browser() {
		return mergeDist(this, BROWSER_CONFIG);
	}

	get browserES5() {
		return mergeDist(this, BROWSER_ES5_CONFIG);
	}

	get kafe() {
		return mergeDist(this, KAFE_CONFIG);
	}

	get kafeES5() {
		return mergeDist(this, KAFE_ES5_CONFIG);
	}


	mergeWithNode(config) {
		ow(config, ow.object.nonEmpty);

		return merge({}, this.node, config);
	}

	mergeWithBrowser(config) {
		ow(config, ow.object.nonEmpty);

		return merge({}, this.browser, config);
	}

	mergeWithBrowserES5(config) {
		ow(config, ow.object.nonEmpty);

		return merge({}, this.browserES5, config);
	}

	mergeWithKafe(config) {
		ow(config, ow.object.nonEmpty);

		return merge({}, this.kafe, config);
	}

	mergeWithKafeES5(config) {
		ow(config, ow.object.nonEmpty);

		return merge({}, this.kafeES5, config);
	}

}



module.exports = LibraryBuilderConfig;
