# ast-replace [![Build Status](https://travis-ci.org/dfcreative/ast-replace.svg?branch=master)](https://travis-ci.org/dfcreative/ast-replace) [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Apply replacements to the source tree.

## Use

`$ npm install --save ast-replace`

```js
var parse = require('esprima').parse;
var Replacer = require('ast-replace');

var ast = parse('var a = 1');

//create replacer instance
var replacer = new Replacer;

//add rule replacing all `foo` assignments with `bar`.
replacer.add(ast, {
	match: 'AssignmentExpression[operator="="]',
	test: function(node){
		return node.left.name === 'foo';
	},
	replace: function(node){
		node.left.name = 'bar';
		return node;
	}
});

//apply replacements
ast = replacer.replace(ast);
```

## API

### Replacer.replace(Node, replacement) → Node

Apply single replacement to a Node.

### Replacer.test(Node, replacement) → Boolean

Test whether node is replaceable.


### new Replacer(options) → Replacer

Replacer class to create stack of replacements.


### Replacer.prototype.add(replacement) → Replacer

Add a new replacement rule to the replacer instance. The replacements will be called in order they’ve been added.

Replacement object defines a rule to apply a single replacement.

| Property | Type | Default | Description |
|---|---|---|---|
| match | _String_ | `'Node'` | Node type to match. Can be a node class: _Node_, _Expression_, _Pattern_, _Statement_, _Function_ or _Declaration_. |
| test | _Function_ | `true` | Test whether node found should be replaced. Testing function should return boolean. |
| replace | _Function_, _Node_, _undefined_, _null_ | `null` | A replacement for a matched node. A replace function should return whether a new node to replace or null. Undefined is considered as no change. |

### Replacer.prototype.test(Node) → Boolean

Test whether node passes the replacement condition. All added rules are tested against the node passed.

### Replacer.prototype.replace(Node) → Node

Apply added replacements to a Node.


[![NPM](https://nodei.co/npm/ast-replace.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ast-replace/)