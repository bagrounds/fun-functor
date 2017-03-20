/**
 *
 * @module fun-functor
 */
;(function () {
  'use strict'

  /* imports */
  var guarded = require('guarded')
  var funAssert = require('fun-assert')
  var curry = require('fun-curry')

  var isFunction = funAssert.type('Function')
  var isAnything = funAssert.pass()

  /* exports */
  module.exports = guarded({
    inputs: [isFunction, isFunction, isAnything],
    f: funFunctor,
    output: isAnything
  })

  module.exports.array = curry(funFunctor)(arrayMap)
  module.exports.objectValue = curry(funFunctor)(objectValueMap)
  module.exports.objectKey = curry(funFunctor)(objectKeyMap)
  module.exports.fArg = curry(funFunctor)(fArgMap)

  /**
   *
   * @function module:fun-functor.funFunctor
   *
   * @param {Function} map - (a -> b, t a) -> t b
   * @param {Function} f - a -> b
   * @param {*} t - t a
   *
   * @return {Function} case function
   */
  function funFunctor (map, f, t) {
    return map(f, t)
  }

  function arrayMap (f, array) {
    return array.map(f)
  }

  function objectValueMap (f, object) {
    return Object.keys(object).reduce(function (newObject, key) {
      newObject[key] = f(object[key])

      return newObject
    }, {})
  }

  function objectKeyMap (f, object) {
    return Object.keys(object).reduce(function (newObject, key) {
      newObject[f(key)] = object[key]

      return newObject
    }, {})
  }

  function fArgMap (f, g) {
    return function () {
      return g.apply(null, Array.prototype.slice.call(arguments).map(f))
    }
  }
})()

