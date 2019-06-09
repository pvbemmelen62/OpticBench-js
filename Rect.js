/**
 * 
 */
function Rect(x0,y0,x1,y1) {
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}
Rect.prototype.toString = function() {
  return JSON.stringify(this);
};
Rect.prototype.canonical = function() {
  var x0 = Math.min(this.x0, this.x1);
  var x1 = Math.max(this.x0, this.x1);
  var y0 = Math.min(this.y0, this.y1);
  var y1 = Math.max(this.y0, this.y1);
  return new Rect(x0,y0,x1,y1);
}
/** Scale rectangle, and translate such that fixedPoint remains fixed.
 * fixedPoint  Point; if omitted the center of the rectangle will be used.
 */
Rect.prototype.scale = function(scale, fixedPoint) {
  fixedPoint = fixedPoint ||
    new Point((this.x0+this.x1)/2, (this.y0+this.y1)/2);
  var s = scale;
  var fx = fixedPoint.x;
  var fy = fixedPoint.y;
  // |s  0  tx|  |fx|   |fx|
  // |0  s  ty|  |fy| = |fy|
  // |0  0   1|  | 1|   | 1|
  var tx = (1-s)*fx;
  var ty = (1-s)*fy;
  T = new Matrix([
   [s, 0, tx],
   [0, s, ty],
   [0, 0, 1]
  ]);
  var q0 = T.mapPoint(new Point(this.x0,this.y0));
  var q1 = T.mapPoint(new Point(this.x1,this.y1));
  var result = new Rect(q0.x,q0.y,q1.x,q1.y);
  return result;
}
/** Returns [lambdaMin,lambdaMax] of line intersections with rectangle.
 * If lambdaMax < lambdaMin then intersection should be considered empty.
 */
Rect.prototype.intersect = function(line) {
  var can = this.canonical();
  var x0 = can.x0;
  var y0 = can.y0;
  var x1 = can.x1;
  var y1 = can.y1;
  var lines = [
    // left of line considered inside rectangle; see lambdaEnters.
    new Line(x0,y0, x1,y0, 1),
    new Line(x1,y0, x1,y1, 1),
    new Line(x1,y1, x0,y1, 1),
    new Line(x0,y1, x0,y0, 1)
  ];
  var lambdaMin = -Number.MAX_VALUE;
  var lambdaMax = Number.MAX_VALUE;
  for(var i=0; i<lines.length; ++i) {
    var lineI = lines[i];
    var lambdas = Line.intersect(line,lineI);
    var L = lambdas[0];
    if(isFinite(L)) {
      if(L === null) {
        throw "null is finite";
      }
      var enters = Line.lambdaEnters(line,lineI);
      if(enters === 1) {
        // lambda >= L
        lambdaMin = Math.max(lambdaMin, L);
      }
      else if(enters === -1) {
        // lambda <= L
        lambdaMax = Math.min(lambdaMax,L);
      }
      else {
        // ignore.
      }
    }
  }
  var result = [lambdaMin,lambdaMax];
  if(Rect.debug !== undefined) {
    Rect.debug("" + this + ".intersect(" + line + ") : " + JSON.stringify(result));
  }
  return result;
}