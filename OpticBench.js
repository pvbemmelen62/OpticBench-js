/**
 * Optic bench.
 * element: html canvas element
 */
function OpticBench(element) {
  this.context2D = element.getContext('2d');
  var canvas = this.context2D.canvas;
  this.bbCanvas = new Rect(0, 0, canvas.width, canvas.height);
  var bbC = this.bbCanvas;
  var offset = 100;
  var scale = 100;
  this.matrixB2C = Matrix.fromRectToRect(            // Bench to Canvas coordinates.
      new Rect(0,0,1,1),
      new Rect(
        bbC.x0+offset, (bbC.y0+bbC.y1)/2,
        bbC.x0+offset+scale, (bbC.y0+bbC.y1)/2-scale
      )
  );
  this.matrixC2B = this.matrixB2C.inverse();
  this.bbBench = this.matrixC2B.map(this.bbCanvas);
  if(OpticBench.debug !== undefined) {
    OpticBench.debug("this.bbBench: " + this.bbBench);
    OpticBench.debug("this.matrixB2C.map(this.bbBench): " + this.matrixB2C.map(this.bbBench));
  }
  // Want to see line ends being clipped:
  this.bbBench = this.bbBench.scale(0.98);
  //
  if(OpticBench.debug !== undefined) {
    OpticBench.debug("this.bbBench: " + this.bbBench);
    OpticBench.debug("this.matrixB2C.map(this.bbBench): " + this.matrixB2C.map(this.bbBench));
  }
  this.axis = new Line(0,0,this.bbBench.x1,0);
  this.lines = [];
  this.lenses = [];
}
OpticBench.prototype.addRay = function(line) {
  this.lines.push(line);
};
OpticBench.prototype.addLens = function(lens) {
  this.lenses.push(lens);
};
OpticBench.prototype.followLine = function(line,currentLens) {
  var ctx = this.context2D;
  var b2c = this.matrixB2C;
  var bbB = this.bbBench;
  var lambdasBB = bbB.intersect(line); // [lambdaMin, lambdaMax]
  if(lambdasBB[1] < 0) {
    return;
  }
  var p0 = line.getPoint(0);
  var lambdaFirst = lambdasBB[1];
  var objectFirst = bbB;
  for(var j in this.lenses) {
    var lens = this.lenses[j];
    if(lens === currentLens) {
      continue;
    }
    var lambdasL = Line.intersect(line, lens.line);
    var hitsLens =
       new Range(0,lambdaFirst).in(lambdasL[0]) &&
       new Range(0,1).in(lambdasL[1]);
    if(hitsLens) {
      objectFirst = lens;
      lambdaFirst = lambdasL[0];
    }
  }
  var p1 = line.getPoint(lambdaFirst);

  new Line(p0.x,p0.y,p1.x,p1.y).draw(this);

  if(objectFirst === bbB) {
    // do nothing
  }
  else if(objectFirst instanceof Lens) {
    var lens = objectFirst;
    var newLine = lens.breakLine(line);
    if(newLine === null) {
      // line may not hit lens, caused by rounding errors.
      throw "line does not hit lens.";
    }
    // Recursive call
    this.followLine(newLine,lens);
  }
  else {
    throw "illegal objectFirst";
  }
}
OpticBench.prototype.draw = function() {
  var ctx = this.context2D;
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  this.axis.draw(this);

  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 2;
  for(var i in this.lines) {
    if(OpticBench.debug !== undefined) {
      OpticBench.debug("this.lines["+i+"]: " + this.lines[i]);
    }
    var line = this.lines[i];
    
    this.followLine(line,null);
  }
  ctx.strokeStyle = "black";
  ctx.font = "12pt monospaced";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.lineWidth = 1;
  for(var i in this.lenses) {
    var lens = this.lenses[i];
    lens.draw(this);
  }
}