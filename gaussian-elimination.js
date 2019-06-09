/**
 * Adapted from
 * https://martin-thoma.com/solving-linear-equations-with-gaussian-elimination/
 */
function Gauss() {
}

/**
 * Calculates x such that A * x = B
 */
Gauss.solveAXisB = function(A, B) {
  var nrA = A.length;
  var ncA = A[0].length;
  var nrB = B.length;
  if(!(ncA == nrB)) throw "incompatible sizes";
  
  var AB = Matrix.concat(A,B);
  for(var r=0; r<nr; ++r) {
    Av[r].push(v[r]);
  }
  for(var i = 0; i < nr; i++) {
    // Search for maximum among Av[i][i] ... Av[nr-1][i]
    var maxEl = Math.abs(Av[i][i]);
    var maxRow = i;
    for (var r = i + 1; r < nr; ++r) {
      if (Math.abs(Av[r][i]) > maxEl) {
        maxEl = Math.abs(Av[r][i]);
        maxRow = r;
      }
    }
    // Swap row i with row maxRow
    for(var c = i; c < nc + 1; ++c) {
      var tmp = Av[maxRow][c];
      Av[maxRow][c] = Av[i][c];
      Av[i][c] = tmp;
    }
    // Make all rows below row i have 0 in column i
    for(r = i + 1; r < nr; ++r) {
      var s = -Av[r][i] / Av[i][i];
      var c = i;
      Av[r][c] = 0;
      ++c;
      for( ; c < nc + 1; ++c) {
        Av[r][c] += s * Av[i][c];
      }
    }
    if(Gauss.debug != undefined) {
      Gauss.debug(Av);
    }
  }
  // Av now has upper triangular form.
  
  // Sweep to give the A in Av identity form:
  for(var r=nr-1; r>=0; --r) {
    // scale row r to have a 1 in column r
    Av[r][nc] /= Av[r][r];
    Av[r][r] = 1;
    // make all rows above row r have a 0 in column r
    for(var r2=r-1; r2>=0; --r2) {
      var s = -Av[r2][r];
      Av[r2][r] = 0;
      Av[r2][nc] = Av[r2][nc] + s * Av[r][nc];
    }
  }
  var x = new Array(nr);
  for(r=0; r<nr; ++r) {
    x[r] = Av[r][nc];
  }
  return x;
}
