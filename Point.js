/**
 * 
 */
function Point(x,y) {
  this.x = x;
  this.y = y;
}
Point.prototype.toString = function() {
  return JSON.stringify(this);
}
/** Returns p.x*q.y-p.y*q.x .*/
Point.outerprod = function(p,q) {
  var result = p.x*q.y - p.y*q.x;
  return result;
}