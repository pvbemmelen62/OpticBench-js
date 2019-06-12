
Lens.counter = 0;

function Lens(x,y,f) {
  this.x = x;
  this.y = y;
  this.f = f;
  this.line = new Line(x,y,x,-y,0);
  this.count = Lens.counter++;
  this.texts = [];
  this.texts.push(new Text("L"+this.count, this.x, 0));
  this.texts.push(new Text("F"+this.count, this.x-this.f, 0));
  this.texts.push(new Text("F"+this.count, this.x+this.f, 0));
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
  // Determine image of line x0,y0 as intersection of
  // line through center of lens, and
  // line through focus (horizontal incoming line, exitting through focus).
  if(L1.y0 === 0) {
    // line through center, and line through focus, are equal.
    // 1/f = 1/(lens.x-obj.x) + 1/(img.x-lens.x)
    var lensX = this.x;
    var objX = L1.x0;
    var imgX = lensX + 1/(1/f - 1/(lensX-objX));
    var is = new Point(lensX, 0);
    var im = new Point(imgX, 0);
  }
  else {
    var intersection = L0.getPoint(lambda0);
    // Determine image of L1 x0,y0 :
    var LC = new Line(L1.x0, L1.y0, this.x, 0, 1); // through center of lens.
    var LF = new Line(this.x, L1.y0, this.x+this.f, 0, 1);   // through focus of lens.
    var lambdas2 = Line.intersect(LC,LF);
    var image = LC.getPoint(lambdas2[0]);
    var is = intersection;
    var im = image;
  }
  var result = new Line(is.x, is.y, im.x, im.y, 1);
  return result;
}
Lens.prototype.draw = function(opticBench) {
  var ob = opticBench;
  this.line.draw(ob);
  for(var i=0; i<this.texts.length; ++i) {
    this.texts[i].draw(ob);
  }
}
