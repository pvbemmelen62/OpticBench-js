/**
 * Text at (x,y) bench coordinates.
 */
function Text(text,x,y) {
  this.text = text;
  this.x = x;
  this.y = y;
}
Text.prototype.draw = function(opticBench) {
  var ob = opticBench;
  var b2c = ob.matrixB2C;
  var ctx = ob.context2D;
  
  var p = new Point(this.x, this.y);
  
  var q = b2c.map(p);
  
  ctx.strokeText(this.text, q.x, q.y);
}