import test from 'ava';
import isAvaCall from '../lib/ava-calls';
import {secondExpression} from './_helpers';

test('straight test call', t => {
	const value = isAvaCall(secondExpression(
		`var test = require('ava');
		test('foo', t => {});`
	));
	t.deepEqual(value, []);
});

test('test is not ava', t => {
	const value = isAvaCall(secondExpression(
		`var test = require('tap');
		test('foo', t => {});`
	));
	t.false(value);
});

test('test.skip', t => {
	const value = isAvaCall(secondExpression(
		`var test = require('ava');
		test.skip('foo', t => {});`
	));
	t.deepEqual(value, ['skip']);
});

test('require("ava").skip', t => {
	const value = isAvaCall(secondExpression(
		`var test = require('ava').skip;
		test('foo', t => {});`
	));
	t.deepEqual(value, ['skip']);
});

test('test = require("ava").serial; test.only', t => {
	const value = isAvaCall(secondExpression(
		`var test = require('ava').serial;
		test.only('foo', t => {});`
	));
	t.deepEqual(value, ['serial', 'only']);
});

test('import test - straight call', t => {
	const value = isAvaCall(secondExpression(
		`import test from 'ava';
		test('foo', t => {});`
	));
	t.deepEqual(value, []);
});

test('import skip ', t => {
	const value = isAvaCall(secondExpression(
		`import {skip} from 'ava';
		skip('foo', t => {});`
	));
	t.deepEqual(value, ['skip']);
});
