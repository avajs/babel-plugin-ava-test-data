var parse = require('babylon').parse;
var traverse = require('babel-traverse').default;

function getPath(code) {
	var ast = parse(code, {sourceType: 'module'});
	var path;
	traverse(ast, {
		Program: function (_path) {
			path = _path;
			_path.stop();
		}
	});
	return path;
}

function firstStatement(code) {
	return getPath(code).get('body')[0];
}

function firstExpression(code) {
	return firstStatement(code).get('expression');
}

function secondStatement(code) {
	return getPath(code).get('body')[1];
}

function secondExpression(code) {
	return secondStatement(code).get('expression');
}

module.exports.firstStatement = firstStatement;
module.exports.firstExpression = firstExpression;
module.exports.secondStatement = secondStatement;
module.exports.secondExpression = secondExpression;
