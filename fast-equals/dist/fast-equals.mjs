var HAS_WEAKSET_SUPPORT = typeof WeakSet === 'function';
var keys = Object.keys;
/**
 * are the values passed strictly equal or both NaN
 *
 * @param a the value to compare against
 * @param b the value to test
 * @returns are the values equal by the SameValueZero principle
 */
function sameValueZeroEqual(a, b) {
    return a === b || (a !== a && b !== b);
}
/**
 * is the value a plain object
 *
 * @param value the value to test
 * @returns is the value a plain object
 */
function isPlainObject(value) {
    return value.constructor === Object || value.constructor == null;
}
/**
 * is the value promise-like (meaning it is thenable)
 *
 * @param value the value to test
 * @returns is the value promise-like
 */
function isPromiseLike(value) {
    return !!value && typeof value.then === 'function';
}
/**
 * is the value passed a react element
 *
 * @param value the value to test
 * @returns is the value a react element
 */
function isReactElement(value) {
    return !!(value && value.$$typeof);
}
/**
 * in cases where WeakSet is not supported, creates a new custom
 * object that mimics the necessary API aspects for cache purposes
 *
 * @returns the new cache object
 */
function getNewCacheFallback() {
    var values = [];
    return {
        add: function (value) {
            values.push(value);
        },
        has: function (value) {
            return values.indexOf(value) !== -1;
        },
    };
}
/**
 * get a new cache object to prevent circular references
 *
 * @returns the new cache object
 */
var getNewCache = (function (canUseWeakMap) {
    if (canUseWeakMap) {
        return function _getNewCache() {
            return new WeakSet();
        };
    }
    return getNewCacheFallback;
})(HAS_WEAKSET_SUPPORT);
/**
 * create a custom isEqual handler specific to circular objects
 *
 * @param [isEqual] the isEqual comparator to use instead of isDeepEqual
 * @returns the method to create the `isEqual` function
 */
function createCircularEqualCreator(isEqual) {
    return function createCircularEqual(comparator) {
        var _comparator = isEqual || comparator;
        return function circularEqual(a, b, cache) {
            if (cache === void 0) { cache = getNewCache(); }
            var isCacheableA = !!a && typeof a === 'object';
            var isCacheableB = !!b && typeof b === 'object';
            if (isCacheableA || isCacheableB) {
                var hasA = isCacheableA && cache.has(a);
                var hasB = isCacheableB && cache.has(b);
                if (hasA || hasB) {
                    return hasA && hasB;
                }
                if (isCacheableA) {
                    cache.add(a);
                }
                if (isCacheableB) {
                    cache.add(b);
                }
            }
            return _comparator(a, b, cache);
        };
    };
}
/**
 * are the arrays equal in value
 *
 * @param a the array to test
 * @param b the array to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta object to pass through
 * @returns are the arrays equal
 */
function areArraysEqual(a, b, isEqual, meta) {
    var index = a.length;
    if (b.length !== index) {
        return false;
    }
    while (index-- > 0) {
        if (!isEqual(a[index], b[index], meta)) {
            return false;
        }
    }
    return true;
}
/**
 * are the maps equal in value
 *
 * @param a the map to test
 * @param b the map to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta map to pass through
 * @returns are the maps equal
 */
function areMapsEqual(a, b, isEqual, meta) {
    var isValueEqual = a.size === b.size;
    if (isValueEqual && a.size) {
        var matchedIndices_1 = {};
        a.forEach(function (aValue, aKey) {
            if (isValueEqual) {
                var hasMatch_1 = false;
                var matchIndex_1 = 0;
                b.forEach(function (bValue, bKey) {
                    if (!hasMatch_1 && !matchedIndices_1[matchIndex_1]) {
                        hasMatch_1 =
                            isEqual(aKey, bKey, meta) && isEqual(aValue, bValue, meta);
                        if (hasMatch_1) {
                            matchedIndices_1[matchIndex_1] = true;
                        }
                    }
                    matchIndex_1++;
                });
                isValueEqual = hasMatch_1;
            }
        });
    }
    return isValueEqual;
}
var OWNER = '_owner';
var hasOwnProperty = Function.prototype.bind.call(Function.prototype.call, Object.prototype.hasOwnProperty);
/**
 * are the objects equal in value
 *
 * @param a the object to test
 * @param b the object to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta object to pass through
 * @returns are the objects equal
 */
function areObjectsEqual(a, b, isEqual, meta) {
    var keysA = keys(a);
    var index = keysA.length;
    if (keys(b).length !== index) {
        return false;
    }
    if (index) {
        var key = void 0;
        while (index-- > 0) {
            key = keysA[index];
            if (key === OWNER) {
                var reactElementA = isReactElement(a);
                var reactElementB = isReactElement(b);
                if ((reactElementA || reactElementB) &&
                    reactElementA !== reactElementB) {
                    return false;
                }
            }
            if (!hasOwnProperty(b, key) || !isEqual(a[key], b[key], meta)) {
                return false;
            }
        }
    }
    return true;
}
/**
 * are the regExps equal in value
 *
 * @param a the regExp to test
 * @param b the regExp to test agains
 * @returns are the regExps equal
 */
function areRegExpsEqual(a, b) {
    return (a.source === b.source &&
        a.global === b.global &&
        a.ignoreCase === b.ignoreCase &&
        a.multiline === b.multiline &&
        a.unicode === b.unicode &&
        a.sticky === b.sticky &&
        a.lastIndex === b.lastIndex);
}
/**
 * are the sets equal in value
 *
 * @param a the set to test
 * @param b the set to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta set to pass through
 * @returns are the sets equal
 */
function areSetsEqual(a, b, isEqual, meta) {
    var isValueEqual = a.size === b.size;
    if (isValueEqual && a.size) {
        var matchedIndices_2 = {};
        a.forEach(function (aValue) {
            if (isValueEqual) {
                var hasMatch_2 = false;
                var matchIndex_2 = 0;
                b.forEach(function (bValue) {
                    if (!hasMatch_2 && !matchedIndices_2[matchIndex_2]) {
                        hasMatch_2 = isEqual(aValue, bValue, meta);
                        if (hasMatch_2) {
                            matchedIndices_2[matchIndex_2] = true;
                        }
                    }
                    matchIndex_2++;
                });
                isValueEqual = hasMatch_2;
            }
        });
    }
    return isValueEqual;
}

var HAS_MAP_SUPPORT = typeof Map === 'function';
var HAS_SET_SUPPORT = typeof Set === 'function';
function createComparator(createIsEqual) {
    var isEqual = 
    /* eslint-disable no-use-before-define */
    typeof createIsEqual === 'function'
        ? createIsEqual(comparator)
        : comparator;
    /* eslint-enable */
    /**
     * compare the value of the two objects and return true if they are equivalent in values
     *
     * @param a the value to test against
     * @param b the value to test
     * @param [meta] an optional meta object that is passed through to all equality test calls
     * @returns are a and b equivalent in value
     */
    function comparator(a, b, meta) {
        if (a === b) {
            return true;
        }
        if (a && b && typeof a === 'object' && typeof b === 'object') {
            if (isPlainObject(a) && isPlainObject(b)) {
                return areObjectsEqual(a, b, isEqual, meta);
            }
            var aShape = Array.isArray(a);
            var bShape = Array.isArray(b);
            if (aShape || bShape) {
                return aShape === bShape && areArraysEqual(a, b, isEqual, meta);
            }
            aShape = a instanceof Date;
            bShape = b instanceof Date;
            if (aShape || bShape) {
                return (aShape === bShape && sameValueZeroEqual(a.getTime(), b.getTime()));
            }
            aShape = a instanceof RegExp;
            bShape = b instanceof RegExp;
            if (aShape || bShape) {
                return aShape === bShape && areRegExpsEqual(a, b);
            }
            if (isPromiseLike(a) || isPromiseLike(b)) {
                return a === b;
            }
            if (HAS_MAP_SUPPORT) {
                aShape = a instanceof Map;
                bShape = b instanceof Map;
                if (aShape || bShape) {
                    return aShape === bShape && areMapsEqual(a, b, isEqual, meta);
                }
            }
            if (HAS_SET_SUPPORT) {
                aShape = a instanceof Set;
                bShape = b instanceof Set;
                if (aShape || bShape) {
                    return aShape === bShape && areSetsEqual(a, b, isEqual, meta);
                }
            }
            return areObjectsEqual(a, b, isEqual, meta);
        }
        return a !== a && b !== b;
    }
    return comparator;
}

var deepEqual = createComparator();
var shallowEqual = createComparator(function () { return sameValueZeroEqual; });
var circularDeepEqual = createComparator(createCircularEqualCreator());
var circularShallowEqual = createComparator(createCircularEqualCreator(sameValueZeroEqual));

export { circularDeepEqual, circularShallowEqual, createComparator as createCustomEqual, deepEqual, sameValueZeroEqual, shallowEqual };
//# sourceMappingURL=fast-equals.mjs.map