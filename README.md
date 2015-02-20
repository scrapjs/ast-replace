# ast-replace [![Build Status](https://travis-ci.org/dfcreative/ast-replace.svg?branch=master)](https://travis-ci.org/dfcreative/ast-replace) [![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Replace each matched ast-node passing a test.


## Usage

`$ npm install --save ast-replace`

```js
var parse = require('esprima').parse;
var generate = require('escodegen').generate;
var replace = require('ast-replace');

//add rule to replace all `foo` assignments with `bar`.
var ast = replace(parse('foo = 1;'), {
	AssignmentExpression: {
		test: function(node){
			if (node.operator !== '=') return false;
			return node.left.name === 'foo';
		},
		replace: function(node){
			node.left.name = 'bar';
			return node;
		}
	}
});

generate(ast); //'bar = 1;'
```


## API

### replace(Node, replacement) → Node

Replace node matching criterias.
Replacement object defines rules to apply replacements:

```js
var replacement = {
	AssignmentExpression: {
		test: function (node) {
			this === replacement; //true

			//returning `undefined` means test is passed
		},
		replace: function (node) {
			this === replacement; //true

			//returning `null` replaces node
			return null;
		}
	},

	//supertype, matched after specific types
	Expression: {
		replace: function (node) {
			//returning `undefined` keeps node the same
		}
	}
}
```

| Property | Type | Default | Description |
|---|---|---|---|
| test | _Function_ | `true` | Test whether node found should be replaced. Testing function should return boolean. If omitted, every node will pass the test. |
| replace | _Function_, _Node_, _undefined_, _null_ | `null` | A replacement for a matched node. Replacing function should return a new node or `null`. `undefined` is considered as no change. |


[![NPM](https://nodei.co/npm/ast-replace.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ast-replace/)