/**
 * Replace AST nodes by rules
 *
 * @module ast-replace
 */

var types = require('ast-types');
var visit = types.visit;
var n = types.namedTypes;
var test = require('ast-test');
var isFunction =  require('is-function');
var assert = require('assert');



/** Apply single replacement to a node */
function replace (node, rules) {
	assert.ok(n.Node.check(node));

	if (!rules) return node;

	//construct visitor
	var visitor = {}, rule;

	for (var match in rules) {
		rule = rules[match];
		visitor['visit' + match] = getReplacer(match, rule, rules);
	}

	visit(node, visitor);

	return node;
}


/** Get replacer for a rule */
function getReplacer (match, rule, rules) {
	return function (path) {
		var node = path.node, res;

		if (testAndReplace(path, rule, rules)) return false;

		//use supertypes, if any
		var superTypes = types.getSupertypeNames(node.type);
		superTypes.forEach(function(type){
			var rule = rules[type];
			if (rule) {
				if (testAndReplace(path, rule, rules)) return false;
			}
		});

		this.traverse(path);
	};
}


/** Test node-path on rule, return true if successful */
function testAndReplace (path, rule, rules) {
	var node = path.node;

	var testResult = isFunction(rule.test) ? rule.test.call(rules, node) : rule.test;

	if (testResult === undefined || testResult) {
		var replaceRes = isFunction(rule.replace) ? rule.replace.call(rules, node) : rule.replace;
		if (replaceRes !== undefined) {
			if (!replaceRes) {
				try {
					path.prune();
				} catch (e) {
					if (!path.parent) {
						throw Error('Cannot prune node `' + node.type + '`. Possibly, it has no parent.');
					} else throw e;
				}
			}
			else {
				path.replace(replaceRes);
			}

			return true;
		}
	}
}


module.exports = replace;