var assert = require('chai').assert;
var Replacer = require('./');
var replace = Replacer.replace;
var test = Replacer.test;
var parse = require('esprima').parse;


describe('Replacer.test',function(){
	it('bad test', function(){
		var ast = parse('var a = 1 + 1;');
		var res = test(ast, {
			test: false
		});
		assert.notOk(res);
	});

	it('good test', function(){
		var ast = parse('var a = 1 + 1;');
		var res = test(ast, {
			test: true
		});
		assert.ok(res);
	});
});


describe('Replacer.replace',function(){
	it('simple replace', function(){
		var ast = parse('var a = 1 + 1;');
		var res = test(ast, {
			test: false
		});
		assert.notOk(res);
	});
});