/**
 * 
 */
function Range(v0,v1) {
  this.min = Math.min(v0,v1);
  this.max = Math.max(v0,v1);
}
/** Returns min <= x <= max .*/
Range.prototype.in = function(x) {
  var result = this.min <= x && x <= this.max;
  return result;
}