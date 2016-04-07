import test from 'ava';
import avaImports, {isAvaRequire, isAvaImport} from '../lib/ava-imports';
import {firstStatement, firstExpression} from './_helpers';

test('isAvaRequire', t => {
	t.true(isAvaRequire(firstExpression(`require('ava');`)));
	t.true(isAvaRequire(firstExpression(`require('ava').serial;`)));
	t.true(isAvaRequire(firstExpression(`require('ava').only;`)));
	t.false(isAvaRequire(firstExpression(`require('not-ava');`)));
});

test('isAvaImport', t => {
	t.true(isAvaImport(firstStatement(`import test from 'ava'`)));
	t.true(isAvaImport(firstStatement(`import test, {skip, todo} from 'ava'`)));
});

test('avaImports', t => {
	t.deepEqual(avaImports(firstStatement(`var test = require('ava');`)), [{
		id: 'test',
		chain: []
	}]);

	var value = avaImports(firstStatement(`var serial = require('ava').serial;`));
	t.deepEqual(value, [{
		id: 'serial',
		chain: ['serial']
	}]);
});
