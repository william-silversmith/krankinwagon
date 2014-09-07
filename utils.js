"use strict";

module.exports.unique = function (list) {
	var obj = {};
	var order = [];
	list.forEach(function (item) {
		if (!obj[item]) {
			order.push(item);
		}

		obj[item] = true;
	});

	return order;
};

/* arrayToHashKeys
 *
 * Converts [1,2,3,'a','b','c'] into
 * { 1: true, 2: true, 3: true, 'a': true, 'b': true, 'c': true }
 * so that you can e.g. efficiently test for existence.
 *
 * Required: 
 *   [0] array: Contains only scalar values
 * 
 * Returns: { index1: true, ... }
 */
module.exports.arrayToHashKeys = function (array) {
	var hash = {};
	for (var i = array.length - 1; i >= 0; i--) {
		hash[array[i]] = true;
	}

	return hash;
};

module.exports.forEach = function (hash, fn) {
	hash = hash || {};

	var keys = Object.keys(hash);
	keys.sort();

	keys.forEach(function (key) {
		fn(key, hash[key]);
	});
};

module.exports.parseCookies = function (request) {
    var cookies = {};
    var rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[parts.shift().trim()] = unescape(parts.join('='));
    });

    var authtoken = cookies['authentication-token'];
	if (authtoken) {
		var idx = authtoken.indexOf(":");
		cookies['token'] = authtoken.substring(idx + 1);
		cookies['user-id'] = parseInt(authtoken.substring(0, idx), 10);
	}

    return cookies;
};

/* setIntervalNow
 *
 * SetInterval, but also execute immediately instead of
 * waiting for the first timeout to occur.
 *
 * Required:
 *	[0] fn
 *  [1] msec   
 *
 * Return: (int) timer_id
 */
module.exports.setIntervalNow = function (fn, msec) {
	fn();
	return setInterval(fn, msec);
};



/* findCallback
 *
 * Often functions are designed so that the final positional
 * argument is the callback. The problem occurs when you can have
 * multiple optional positional arguments.
 *
 * Pass "arguments" to this function and it'll find the callback
 * for you.
 *
 * Required:
 *   [0] args: literally the "arguments" special variable
 *
 * Return: fn or null
 */
 module.exports.findCallback = function (args) {
 	var callback = null;

 	for (var i = args.length - 1; i >= 0; i--) {
 		if (typeof(args[i] === 'function')) {
 			callback = args[i];
 			break;
 		}
 	}

 	return callback;
 };

/* compose
 *
 * Compose N functions into a single function call.
 *
 * Required: 
 *   [0-n] functions or arrays of functions
 * 
 * Returns: function
 */
module.exports.compose = function () {
	var fns = module.exports.flatten(arguments);

	return function () {
		for (var i = 0; i < fns.length; i++) {
			fns[i].apply(this, arguments);
		}
	};
};

/* flatten
 *
 * Take an array that potentially contains other arrays 
 * and return them as a single array.
 *
 * e.g. flatten([1, 2, [3, [4]], 5]) => [1,2,3,4,5]
 *
 * Required: 
 *   [0] array
 * 
 * Returns: array
 */
module.exports.flatten = function (array) {
	array = array || [];

	var flat = [];

	var len = array.length;
	for (var i = 0; i < len; i++) {
		var item = array[i];

		if (typeof(item) === 'object' && Array.isArray(item)) {
			flat = flat.concat(module.exports.flatten(item));
		}
		else {
			flat.push(item);
		}
	} 

	return flat;
};

/* arrayToHashKeys
 *
 * Converts [1,2,3,'a','b','c'] into
 * { 1: true, 2: true, 3: true, 'a': true, 'b': true, 'c': true }
 * so that you can e.g. efficiently test for existence.
 *
 * Required: 
 *   [0] array: Contains only scalar values
 * 
 * Returns: { index1: true, ... }
 */
module.exports.arrayToHashKeys = function (array) {
	var hash = {};
	for (var i = array.length - 1; i >= 0; i--) {
		hash[array[i]] = true;
	}

	return hash;
};

/* unique
 *
 * Take an array of elements and return only 
 * unique values. This function respects
 * the stability of the array based on
 * first occurrence.
 *
 * Required:
 *   [0] list: e.g. [ 1, 1, 4, 5, 2, 4 ]
 *
 * Return: [ e.g. 1, 4, 5, 2 ]
 */
module.exports.unique = function (list) {
	var obj = {};
	var order = [];
	list.forEach(function (item) {
		if (!obj[item]) {
			order.push(item);
		}

		obj[item] = true;
	});

	return order;
};

module.exports.clone = function (obj) {
	return JSON.parse(JSON.stringify(obj));
};

/* clamp
 *
 * Bound a value between a minimum and maximum value.
 *
 * Required: 
 *   [0] value: The number to evaluate
 *   [1] min: The minimum possible value
 *   [2] max: The maximum possible value
 * 
 * Returns: value if value in [min,max], min if less, max if more
 */
module.exports.clamp = function (value, min, max) {
	return Math.max(Math.min(value, max), min);
};

/* indexOfAttr
 *
 * For use with arrays of objects. It's
 * Array.indexOf but against an attribute
 * of the array.
 *
 * Required: 
 *   [0] value: searching for this
 *   [1] array
 *   [2] attr: e.g. description in [ { description }, { description } ]
 * 
 * Returns: index or -1 if not found
 */
module.exports.indexOfAttr = function (value, array, attr) {
	for (var i in array) {
		if (array[i][attr] === value) {
			return i;
		}
	}

	return -1;
};

/* invertHash
 *
 * Turns a key => value into value => key.
 *
 * Required:
 *   [0] hash
 *
 * Return: inverted hash { value: key }
 */
module.exports.invertHash = function (hash) {
	hash = hash || {};

	var inversion = {};
	for (var key in hash) {
		if (!hash.hasOwnProperty(key)) { continue; }
		inversion[hash[key]] = key;
	}

	return inversion;
};

/* sumattr
 *
 * Since javascript doesn't do summing maps very gracefully,
 * here's a hack to take care of a common case of a single
 * level of depth.
 *
 * Required:
 *   [0] list: array of numbers
 *   [1] attr: The name of an attribute common to all the elements in list (e.g. list[0].attr )
 *
 * Returns: sum of all the attributes
 */
module.exports.sumattr = function (list, attr) {
	var total = 0;
	for (var i = list.length - 1; i >= 0; i--) {
		total += list[i][attr];
	};

	return total;		
};

/* sum
 *
 * Returns the sum off all the elements of an array.
 *
 * Required: 
 *  [0] array of numbers
 *
 * Returns: sum of array
 */
module.exports.sum = function (list) {
	var total = 0;
	for (var i = list.length - 1; i >= 0; i--) {
		total += list[i];
	};

	return total;
};

/* median
 *
 * Given an array of numbers, returns the median.
 *
 * Required: array of numbers
 *
 * Returns: median
 */
module.exports.median = function (list) {
	list.sort();

	if (list.length === 0) {
		return null;
	}

	var middle = Math.ceil(list.length / 2);
	if (list.length % 2 === 0) {
		return (list[middle] + list[middle - 1]) / 2;
	}
	return list[middle];
};

/* truncate
 *
 * Provides a method of truncating the decimal 
 * of a javascript number.
 *
 * Required:
 *  [0] n: The number you wish to truncate
 *
 * Returns: The truncated number
 */
module.exports.truncate = function (n) {
	if (n > 0) {
		return Math.floor(n);
	}

	return Math.ceil(n);
};

/* seemingly_random
 *
 * A pseudo-random number generator that takes
 * a seed. Useful for creating random seeming events
 * that are coordinated across all players' computers.
 *
 * Cribbed from: http://stackoverflow.com/questions/521295/javascript-random-seeds
 *
 * Required: 
 *   [0] seed
 * 
 * Returns: floating point [0, 1] determined by the seed 
 * 
 * NOTE: YOU MUST MANUALLY INCREMENT THE SEED YOURSELF
 */
module.exports.seemingly_random = function (seed) {
	var x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
};

/* random_choice
 *
 * Selects a random element from an array with replacement.
 *
 * Required:
 *   [0] array
 *
 * Returns:
 */
module.exports.random_choice = function (array) {
	if (!array.length) {
		return undefined;
	}

	var random_int = Math.round(Math.random() * (array.length - 1));

	return array[random_int];
};

module.exports.random_choice_no_replacement = function (array) {
	if (!array.length) {
		return undefined;
	}

	var random_int = Math.round(Math.random() * (array.length - 1));

	var val = array[random_int];
	array.splice(random_int, 1);

	return val;
};

/* plural
 *
 * Given a count and a string encoded as described below,
 * parse it so that it is either singular or plural.
 *
 * Strings may be written as such:
 *
 * var x = 1;
 * Utils.plural(x, "I have " + x + " cars[[s]]")
 * => "I have 1 car"
 *
 * x = ['porshe']
 * Utils.plural(x, "I have [[a|some]] car[[s]]. [[It|The first]] is a " + x[0]) 
 * => "I have a car. It is a porshe".
 * 
 * x = 2;
 * Utils.plural(x, "Do you have [[a child|children]]?")
 * => "Do you have children?"
 *
 * Required:
 *   [0] ct: A number or an array whose quantity 
 *          or length indicates the singularness or plurality
 *   [1] phrase: A suitably encoded phrase
 *
 * Returns: A pluralized string
 */
module.exports.plural = function (ct, phrase) {
	var isplural = false;

	if (typeof(ct) === 'number') {
		isplural = (ct !== 1);
	}
	else {
		isplural = (ct.length !== 1);
	}

	var multicapture = /\[\[([^\]])+?\]\]/g;
	var singlecapture = /\[\[([^\]])+?\]\]/;

	var phrasecopy = phrase;

	var match;
	while (match = multicapture.exec(phrase)) {
		var maybepair = match[1].split(/\|/);

		var singular;
		var pluralversion;
		if (maybepair.length === 2) {
			singular = maybepair[0];
			pluralversion = maybepair[1];
		}
		else {
			singular = "";
			pluralversion = maybepair[0];
		}

		var replacement = isplural 
			? pluralversion
			: singular;

		phrasecopy = phrasecopy.replace(singlecapture, replacement);
	}

	return phrasecopy;
};

