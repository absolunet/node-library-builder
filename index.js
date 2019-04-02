//--------------------------------------------------------
//-- Library builder
//--------------------------------------------------------
'use strict';

const ow   = require('ow');
const path = require('path');
const fss  = require('@absolunet/fss');
const __   = require('@absolunet/private-registry');

const LibraryBuilderConfig = require('./lib/config');






class LibraryBuilder {

	constructor({ name, root }) {
		ow(name, ow.string.nonEmpty);
		ow(root, ow.string.nonEmpty);

		const DIST = path.resolve(root, 'dist');

		__(this).set('config', new LibraryBuilderConfig({
			name: name,
			root: root,
			dist: DIST
		}));

		fss.removePattern(`${DIST}/*`);
	}


	get config() {
		return __(this).get('config');
	}

}


module.exports = LibraryBuilder;
