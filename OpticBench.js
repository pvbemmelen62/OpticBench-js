/**
 * Optic bench.
 */
function OpticBench(canvas) {
  var bcr = canvas.getBoundingClientRect();  // object with x,y,width,height members.
  this.bbCanvas = new Rect(bcr.x, bcr.y, bcr.x+bcr.width, bcr.y+bcr.height);
  this.context2D = canvas.getContext('2d');
  var bb = this.bbCanvas;
  var offset = 100;
  var scale = 100;
  this.matrixB2C = Matrix.fromRectToRect(            // Bench to Canvas coordinates.
      { x0: 0, y0: 0, x1: 1, y1: 1},
      { x0: bb.x0+offset, y0: (bb.y0+bb.y1)/2,
        x1: bb.x0+offset+scale, y1: (bb.y0+bb.y1)/2-scale
      }
  );
  this.matrixC2B = this.matrixB2C.inverse();
  var p0 = new Point(bb.x0, bb.y0);
  var q0 = this.matrixC2B.map(p0);
  var p1 = new Point(bb.x1, bb.y1);
  var q1 = this.matrixC2B.map(p1);
  this.bbBench = new Rect(q0.x, q0.y, q1.x, q1.y);
  if(OpticBench.debug !== undefined) {
    OpticBench.debug(JSON.stringify(this.bbBench));
  }
  this.lines = [];
  this.lenses = [];
}
OpticBench.prototype.addRay = function(line) {
  this.lines.push(line);
}
OpticBench.prototype.addLens = function(lens) {
  this.lenses.push(lens);
}
OpticBench.prototype.draw = function() {
  var ctx = this.context2D;
  var b2c = this.matrixB2C;
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 5;
  for(var i in this.lines) {
    if(OpticBench.debug !== undefined) {
      OpticBench.debug(JSON.stringify(this.lines[i]));
    }
    var line = this.lines[i];

    var bbBsmall = this.bbBench.scale(0.98);
    var lambdas = bbBsmall.intersect(line); // [lambdaMin, lambdaMax]
    var p0 = line.getPoint(0);
    var p1 = line.getPoint(lambdas[1]);
    var q0 = b2c.map(p0);
    var q1 = b2c.map(p1);

    var lambdaFirst = lambdas[1];
    for(var j in this.lenses) {
      var lens = this.lenses[j];
      var lambdas = Line.intersect(line, lens.line);
      if(lambdas[0] > 0 && lambdas[0] < lambdaFirst &&
          lambdas[1] > 0 && lambdas[1] < 1) {
        ga hier verder
      }
    }
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(q0.x,q0.y);
    ctx.lineTo(q1.x,q1.y);
    ctx.stroke();
  }
}