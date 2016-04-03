'use strict';

function _flattenMemberExpressions(path, computedProperty) {
	if (path.isMemberExpression()) {
		var object = _flattenMemberExpressions(path.get('object'), true);
		var property = _flattenMemberExpressions(path.get('property'), path.node.computed);
		return object.concat(property);
	}
	if (computedProperty) {
		if (path.isStringLiteral()) {
			return [path.node.value];
		}
		if (path.isIdentifier()) {
			var binding = path.scope.getBinding(path.node.name);
			if (binding && binding.constant && binding.path.node.init && binding.path.get('init').isStringLiteral()) {
				return [binding.path.get('init').node.value];
			}
		}
	} else if (path.isIdentifier()) {
		return [path.node.name];
	}
	return [path];
}

function flattenMemberExpressions(path) {
	return _flattenMemberExpressions(path, true);
}

module.exports = flattenMemberExpressions;
