'use strict';
var avaCalls = require('./lib/ava-calls');

var KEY = 'ava-call-expressions';

module.exports = function () {
	return {
		visitor: {
			CallExpression: function (path, state) {
				var call = avaCalls(path);
				if (call) {
					var metadata = state.file.metadata;
					var arr = metadata[KEY] = metadata[KEY] || [];
					arr.push(call);
				}
			}
		}
	};
};

module.exports.metadata = function (file, create) {
	return file.metadata[KEY] || (create ? [] : null);
};
