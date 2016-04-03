'use strict';
var flatten = require('./flatten-member-expressions');

function isAvaLiteral(lit) {
	return lit.isStringLiteral({value: 'ava'});
}

function isAvaRequireArgs(args) {
	return args.length === 1 && isAvaLiteral(args[0]);
}

function walkUpMemberExpression(init) {
	while (init && init.isMemberExpression()) {
		init = init.get('object');
	}
	return init;
}

function isAvaRequireCall(init) {
	init = walkUpMemberExpression(init);
	return init && init.isCallExpression() &&
		init.get('callee').isIdentifier({name: 'require'}) &&
		isAvaRequireArgs(init.get('arguments'));
}

function isAvaRequire(decl) {
	return decl && decl.isVariableDeclarator() && isAvaRequireCall(decl.get('init'));
}

function isAvaImport(decl) {
	return decl && decl.isImportDeclaration() && isAvaLiteral(decl.get('source'));
}

function convertDeclarator(decl) {
	var chain = decl.get('init').isMemberExpression() ? flatten(decl.get('init')).slice(1) : [];
	return {
		id: decl.get('id').node.name,
		chain: chain
	};
}

function convertSpecifier(specifier) {
	if (specifier.isImportDefaultSpecifier()) {
		return {
			id: specifier.get('local').node.name,
			chain: []
		};
	}
	if (specifier.isImportSpecifier()) {
		return {
			id: specifier.get('local').node.name,
			chain: [specifier.get('imported').node.name]
		};
	}
}

module.exports = function (decl) {
	if (decl.isVariableDeclaration()) {
		return decl.get('declarations')
			.filter(function (decl) {
				return isAvaRequire(decl);
			})
			.map(convertDeclarator);
	}
	if (isAvaRequire(decl)) {
		return [convertDeclarator(decl)];
	}
	if (isAvaImport(decl)) {
		return decl.get('specifiers').map(convertSpecifier);
	}
	if ((decl.isImportDefaultSpecifier() || decl.isImportSpecifier()) && isAvaImport(decl.parentPath)) {
		return [convertSpecifier(decl)];
	}
	return null;
};

module.exports.isAvaRequire = isAvaRequireCall;
module.exports.isAvaImport = isAvaImport;
