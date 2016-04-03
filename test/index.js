import test from 'ava';
import * as babel from 'babel-core';
import plugin from '../';

function inspect(source) {
	return plugin.metadata(babel.transform(
		source,
		{
			plugins: [plugin]
		}
	));
}

test('import ava - use directly', t => {
	var metadata = inspect(
		`import test from 'ava';
		test('foo', t => {});`
	);

	t.same(metadata, [[]]);
});

test('import non ava', t => {
	var metadata = inspect(
		`import test from 'tap';
		test('foo', t => {});`
	);

	t.same(metadata, null);
});

test('import skip - use directly', t => {
	var metadata = inspect(
		`import {skip} from 'ava';
		skip('foo', t => {});`
	);

	t.same(metadata, [['skip']]);
});

test('import serial - skip it', t => {
	var metadata = inspect(
		`import {serial} from 'ava';
		serial.skip('foo', t => {});`
	);

	t.same(metadata, [['serial', 'skip']]);
});

test('import serial - multiple uses', t => {
	var metadata = inspect(
		`import {serial} from 'ava';
		serial('foo', t => {});
		serial.skip('bar', t => {});`
	);

	t.same(metadata, [['serial'], ['serial', 'skip']]);
});

test('multiple imports - multiple uses', t => {
	var metadata = inspect(
		`import test, {serial} from 'ava';
		test('foo', t => {});
		test.skip('bar', t => {});
		serial.skip('baz', t => {});`
	);

	t.same(metadata, [[], ['skip'], ['serial', 'skip']]);
});
