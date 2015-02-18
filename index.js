/**
 * Replace AST nodes by rules
 *
 * @module ast-replace
 */

var visit = require('ast-types').visit;
var isFunction =  require('is-function');
var appendProps = require('soft-extend');


/**
 * Replacer class to make multiple replacements.
 *
 * @constructor
 */
function Replacer () {
	//stack of rules
	this.rules = [];
}


/** Apply single replacement to a node */
Replacer.replace = function(node, rule){
	rule = appendProps(rule || {}, {
		match: 'Node',
		test: true,
		replace: null,
	});

	//construct visitor
	var visitor = {};
	visitor['visit' + rule.match] = function (path) {
		this.traverse(path);
		var node = path.node;

		if (Replacer.test(node, rule))
		return isFunction(rule.replace) ? rule.replace(node) : rule.replace;
	};

	return node;
};


/** Test whether single node is replaceable */
Replacer.test = function(node, rule){
	rule = appendProps(rule || {}, {
		match: 'Node',
		test: true
	});

	//construct visitor
	var visitor = {};
	visitor['visit' + rule.match] = function (path) {
		this.traverse(path);
		var node = path.node;

		//break traversing, if some bad node found
		if (isFunction(rule.test)) {
			if (rule.test(node) === false) throw 1;
		}
		else {
			if (rule.test === false) throw 1;
		}
	};

	try {
		visit(node, visitor);
	} catch (e) {
		return false;
	}

	return true;
};



var proto = Replacer.prototype;


/**
 * Add new replacement rule
 * {match, test, replace}
 */
proto.add = function(replacement){

};


module.exports = Replacer;