
function Lens(x,y,f) {
  this.x = x;
  this.y = y;
  this.f = f;
  this.line = new Line(x,y,x,-y,0);
}
/**
 * If line intersects the lens, then return the line leaving the lens; else return
 * null.
 */
Lens.prototype.breakLine = function(line) {
  var L0 = this.line;
  var L1 = line;
  var lambdas = Line.intersect(L0,L1);
  var lambda0 = lambdas[0];
  var lambda1 = lambdas[1];
  var hit = 0 < lambda1 && 0 < lambda0 && lambda0 < 1;
  if(!hit) {
    return null;
  }
  var intersection = L0.getPoint(lambda0);
  // Determine image of L1 x0,y0 :
  var LC = new Line(L1.x0, L1.y0, x, 0, 1); // through center of lens.
  var LF = new Line(x, L1.y0, x+f, 0, 1);   // through focus of lens.
  var lambdas2 = Line.intersect(LC,LF);
  var image = LC.getPoint(lambdas2[0]);
  var is = intersection;
  var im = image;
  var result = new Line(is.x, is.y, im.x, im.y, 1);
  return result;
}