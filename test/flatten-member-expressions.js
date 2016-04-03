import test from 'ava';
import * as types from 'babel-types';
import flatten from '../lib/flatten-member-expressions';
import {firstExpression, secondExpression} from './_helpers';

test('foo.bar', t => {
	var list = flatten(firstExpression(`foo.bar`));
	t.ok(types.isIdentifier(list[0].node, {name: 'foo'}));
	t.same(list.slice(1), ['bar']);
});

test('foo.bar.baz', t => {
	var list = flatten(firstExpression(`foo.bar.baz`));
	t.ok(types.isIdentifier(list[0].node, {name: 'foo'}));
	t.same(list.slice(1), ['bar', 'baz']);
});

test('foo["bar"].baz', t => {
	var list = flatten(firstExpression(`foo["bar"].baz`));
	t.ok(types.isIdentifier(list[0].node, {name: 'foo'}));
	t.same(list.slice(1), ['bar', 'baz']);
});

test('foo[bar].baz', t => {
	var list = flatten(firstExpression(`foo[bar].baz`));
	t.ok(types.isIdentifier(list[0].node, {name: 'foo'}));
	t.ok(types.isIdentifier(list[1].node, {name: 'bar'}));
	t.same(list.slice(2), ['baz']);
});

test('foo[bar][baz]', t => {
	var list = flatten(firstExpression(`foo[bar][baz]`));
	t.ok(types.isIdentifier(list[0].node, {name: 'foo'}));
	t.ok(types.isIdentifier(list[1].node, {name: 'bar'}));
	t.ok(types.isIdentifier(list[2].node, {name: 'baz'}));
	t.is(list.length, 3);
});

test('const baz = `baz`; foo[bar][baz]', t => {
	var list = flatten(secondExpression(`var baz = 'baz'; foo[bar][baz]`));
	t.ok(types.isIdentifier(list[0].node, {name: 'foo'}));
	t.ok(types.isIdentifier(list[1].node, {name: 'bar'}));
	t.same(list.slice(2), ['baz']);
});

// test('foo[bar].baz')
