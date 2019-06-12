/**
 * Line from (x0,y0) to (x1,y1) .
 * type: 0 : does not extend beyond ends ; 1: extends beyond (x0,y0); 2: extends beyond (x1,y1); 3: extends beyond both ends.
 */
function Line(x0,y0,x1,y1,type) {
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.type = type;
};
Line.prototype.toString = function() {
  return JSON.stringify(this);
}
Line.prototype.draw = function(opticBench) {
  var ob = opticBench;
  var b2c = ob.matrixB2C;
  var ctx = ob.context2D;
  
  var p0 = new Point(this.x0, this.y0);
  var p1 = new Point(this.x1, this.y1);
  
  //new Circle(p0.x,p0.y,0.2).draw(opticBench);
  //new Circle(p1.x,p1.y,0.2).draw(opticBench);

  var q0 = b2c.map(p0);
  var q1 = b2c.map(p1);
  
  if(Line.debug !== undefined) {
    Line.debug("q0: " + q0);
    Line.debug("q1: " + q1);
  }

  ctx.beginPath();
  ctx.moveTo(q0.x,q0.y);
  ctx.lineTo(q1.x,q1.y);
  ctx.stroke();
};
/** Point along line, with lamda=0 for [x0,y0], and lambda=1 for [x1,y1] . */
Line.prototype.getPoint = function(lambda) {
  var s0 = 1-lambda;
  var s1 = lambda;
  var p = new Point(this.x0*s0+this.x1*s1, this.y0*s0+this.y1*s1);
  return p;
};
/** Returns [lambda0,lambda1] such that line0.getPoint(lambda0) equals line1.getPoint(lamdba1).
 * Either lambda may be NaN in case of parallel lines.
 */
Line.intersect = function(line0,line1) {
  // x0  + L0 * (x1-x0) = x2 + L1 * (x3-x2) 
  // y0  + L0 * (y1-y0) = y2 + L1 * (y3-y2) 
  var x0 = line0.x0;
  var y0 = line0.y0;
  var x1 = line0.x1;
  var y1 = line0.y1;
  var x2 = line1.x0;
  var y2 = line1.y0;
  var x3 = line1.x1;
  var y3 = line1.y1;
  var X = Matrix.solveAXisB(
    new Matrix(
      [[x1-x0, x3-x2],
       [y1-y0, y3-y2]
      ]
    ),
    new Matrix(
      [[x2-x0],
       [y2-y0]
      ]
    )
  );
  X = X.transpose();
  var row = X.m[0];
  var lambdas = [row[0],-row[1]];
  return lambdas;
};
/** Returns -1,0,1 to indicate if line0, in increasing lambda direction, enters the
 * halfplane defined by line1. The halfplane lies on the left of line1 when looking
 * down on line1 (eye.z is positive, view direction towards -z), when going from
 * line1 x0,y0 to line1 x1,y1.
 * Return value: 1 if enters, 0 if parallel, -1 if leaves.
 */
Line.lambdaEnters = function(line0, line1) {
  var p = line0;
  var q = line1;
  var p01 = new Point(p.x1-p.x0, p.y1-p.y0);
  var q01 = new Point(q.x1-q.x0, q.y1-q.y0);
  var outProd = Point.outerprod(p01,q01);
  if(outProd > 0) {
    return -1;
  }
  else if(outProd < 0) {
    return 1;
  }
  else if(diff===0) {
    return 0;
  }
  else {
    return undefined;
  }
}
