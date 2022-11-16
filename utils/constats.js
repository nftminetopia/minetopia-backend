/**
 *
 * @param {any} a is first value to compare
 * @param {any} b is ssecond value to compare
 * @returns {Boolean}
 */
module.exports.areEqual = (a, b) =>
  String(a).toLowerCase() === String(b).toLowerCase();
