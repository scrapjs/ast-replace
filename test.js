var assert = require('chai').assert;
var replace = require('./');
var test = require('ast-test');
var parse = require('esprima').parse;
var generate = require('escodegen').generate;


describe('replace',function () {
	it('readme example', function () {
		//add rule to replace all `foo` assignments with `bar`.
		var ast = replace(parse('foo = 1;'), {
			AssignmentExpression: {
				test: function (node) {
					if (node.operator !== '=') return false;
					return node.left.name === 'foo';
				},
				replace: function (node) {
					node.left.name = 'bar';
					return node;
				}
			}
		});

		assert.equal(generate(ast), 'bar = 1;');
	});

	it('static, supertype & omitted', function () {
		//add rule to replace all `foo` assignments with `bar`.
		var ast = replace(parse('foo = 1; bar = 2; foo = 3;'), {
			AssignmentExpression: {
				test: function (node) {
					if (node.operator !== '=') return false;
					return node.left.name === 'foo';
				},
				replace: null
			},
			Expression: {
				replace: function (node) {
					if (node.left) node.left.name = 'baz';
				}
			}
		});

		assert.equal(generate(ast, {format: {indent: {style: ''}, newline: ''}}), 'baz = 2;');
	});

	it('empty ast in result', function () {
		//add rule to replace all `foo` assignments with `bar`.
		assert.throws(function(){
			replace(parse('foo = 1;').body[0], {
				AssignmentExpression: {
					test: function (node) {
						if (node.operator !== '=') return false;
						return node.left.name === 'foo';
					},
					replace: null
				}
			});
		}, 'Cannot prune node');
	});
});