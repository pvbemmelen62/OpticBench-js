/**
 * 
 */
function Circle(x,y,radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
}
Circle.prototype.draw = function(opticBench) {
  var ob = opticBench;
  var b2c = ob.matrixB2C;
  var ctx = ob.context2D;

  var cC = b2c.map(new Point(this.x, this.y)); // center in Canvas coordinates.
  
  scale = b2c.m[0][0];
  
  var rC = this.radius * scale; // radius in Canvas coordinates.

  ctx.beginPath();
  ctx.moveTo(cC.x+rC,cC.y);
  ctx.arc(cC.x,cC.y,rC,0,2*3.1415936535,true)
  ctx.closePath();
  ctx.fill();
}
