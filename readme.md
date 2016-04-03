# babel-plugin-ava-test-data [![Build Status](https://travis-ci.org/jamestalmage/babel-plugin-ava-test-data.svg?branch=master)](https://travis-ci.org/jamestalmage/babel-plugin-ava-test-data)

> My bee&#39;s knees module


## Install

```
$ npm install --save babel-plugin-ava-test-data
```


## Usage

```js
import * as babel from 'babel-core';
import plugin from 'babel-plugin-test-data';

var result = babel.transform(
  `
  import test from 'ava';

  test(t => {});                   // adds empty array to metadata
  test.skip('foo', t => {});       // adds array ['skip'] to metadata
  test.serial.cb('foo', t => {});  // adds array ['serial', 'cb'] to metadata
  `,
  {plugins: [plugin]}
);

//

var metadata = plugin.metadata(result);
```

Resulting metadata is:

```js
metadata = [
  [],
  ['skip'],
  ['serial', 'cb']
]
```


## API

### plugin.metadata(result, [create])

Extract the test call metadata from the babel result.

#### result

Type: `babel transform result`

The result from calling `babel.transform`

#### create

Type: `boolean` <br>
Default: `false`

If `true` and no test calls were found, create and return an empty array. This guarantees the result is always an array. Otherwise it will return `null` if no test calls are found.

## License

MIT © [James Talmage](http://github.com/jamestalmage)
