var avaImports = require('./ava-imports');
var flatten = require('./flatten-member-expressions');

function isAvaCall(path) {
	if (!path.isCallExpression()) {
		return false;
	}
	var flattened = flatten(path.get('callee'));
	var head = flattened && flattened[0];
	if (!(head && head.isIdentifier())) {
		return false;
	}

	var id = head.node.name;

	if (!path.scope.hasBinding(id)) {
		return false;
	}

	var binding = path.scope.bindings[id];

	var init = avaImports(binding.path);

	if (!init) {
		return false;
	}

	init = init.filter(function (obj) {
		return obj.id === id;
	});

	if (init.length !== 1) {
		throw new Error('something went wrong');
	}

	return init[0].chain.concat(flattened.slice(1));
}

module.exports = isAvaCall;
