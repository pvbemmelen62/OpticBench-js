
function ArrayFormatter() {}

/**
 * Returns string that is nicely printed matrix.
 * @param matrix two-dimensional array of numbers.
 * @param minCellWidth cells will be padded to this size if needed.
 * @param newline string that will be printed for each end of row.
 * @param delimiter string that will be printed between cells
 * @returns {String}
 */
ArrayFormatter.twoDim = function(matrix, minCellWidth, newline, delimiter) {
  var m = matrix;
  var nr = m.length;
  var nc = m[0].length;
  var A = new Array(nr);
  var nl = newline;
  var lengths = new Array(nc);
  for(var c=0; c<nc; ++c) {
    lengths[c] = minCellWidth;
  }
  for(var r=0; r<nr; ++r) {
    A[r] = new Array(nc);
    for(var c=0; c<nc; ++c) {
      A[r][c] = String(m[r][c]);
      lengths[c] = Math.max(lengths[c], A[r][c].length);
    }
  }
  var res = "[" + nl;
  for(var r=0; r<nr; ++r) {
    var line = "  [";
    for(var c=0; c<nc; ++c) {
      var len = A[r][c].length;
      line += " ".repeat(lengths[c]-len) + A[r][c];
      if(c < nc-1) {
        line += delimiter;
      }
    }
    line += "]";
    if(r < nr-1){
      line += delimiter;
    }
    line += nl;
    res += line;
  }
  res += nl;
  return res;
}