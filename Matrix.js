/** Two-dimensional matrix with all rows having same size.
 * m : two dimensinal array of numbers, will be stored in Matrix object.
 */
Matrix = function(m) {
    this.m = m;
    if(m[0] === undefined) throw "m is not a matrix";
    var numCols = m[0].length;
    for(var r=1; r<m.length; ++r) {
        var okay = m[r].length == numCols;
        if(!okay) {
            throw "Invalid input: matrix has rows of varying length.";
        }
    }
};
/** Returns identity matrix of size n. */
Matrix.identity = function(n) {
  var m = new Array(n);
  for(var r=0; r<n; ++r) {
    var row = new Array(n);
    for(var c=0; c<n; ++c) {
      row[c] = c===r ? 1 : 0;
    }
    m[r] = row;
  }
  return new Matrix(m);
};
/** Checks that each row has length equal to the number of rows. */
Matrix.prototype.isSquare = function() {
  var nr = m.length;
  for(var r=0; r<nr; ++r) {
    if(m[r].length != nr) {
      return false;
    }
  }
  return true;
};
/** Returns a copy of <code>this</code> */
Matrix.prototype.copy = function(m) {
  var m = this.m;
  var A = new Array(m.length);
  for(var r=0; r<m.length; ++r) {
      A[r] = new Array(m[r].length);
      for(var c=0; c<m[r].length; ++c) {
          A[r][c] = m[r][c];
      }
  }
  var copy = new Matrix(A);
  return copy;
};
/** Returns a new matrix that is concatenation of <code>this + m</code>.
 * Throws exception if this and m don't have same number of rows.*/
Matrix.prototype.concat = function(m) {
  var A = this.m;
  var B = m.m;
  if(A.length != B.length) throw "Incompatible dimensions";
  var n = A.length;
  var ncA = A[0].length;
  var ncB = B[0].length;
  var R = new Array(n);
  for(var r=0; r<n; ++r) {
	  R[r] = new Array(ncA+ncB);
	  for(var c=0; c<ncA; ++c) {
		  R[r][c]=A[r][c];
	  }
	  for(var c=0; c<ncB; ++c) {
		  R[r][ncA+c] = B[r][c];
	  }
  }
  return new Matrix(R);
};
/** Returns a new matrix that is the transpose of this matrix.*/
Matrix.prototype.transpose = function() {
  var A = this.m;
  var nrA = A.length;
  var ncA = A[0].length;
  var nrB = ncA;
  var ncB = nrA;
  var B = new Array(nrB);
  for(var r=0; r<nrB; ++r) {
    var row = new Array(ncB);
    for(var c=0; c<ncB; ++c) {
      row[c] = A[c][r];
    }
    B[r] = row;
  }
  var T = new Matrix(B);
  return T;
};
/** Returns new matrix that is product of <code>this</code> matrix and m.
 * m : number of rows must equal number of columns of <code>this</code> matrix.
 */
Matrix.prototype.multiply = function(m) {
  var A = this.m;
  var B = m.m;
  var nrA = A.length;
  var ncA = A[0].length;
  var nrB = B.length;
  var ncB = B[0].length;
  if(ncA !== nrB) throw "Incompatible sizes.";
  var nrC = nrA;
  var ncC = ncB;
  var C = new Array(nrC);
  for(var r=0; r<nrC; ++r) {
    var row = new Array(ncC);
    for(var c=0; c<ncC; ++c) {
      var cell = 0;
      for(var i=0; i<ncA; ++i) {
        cell += A[r][i]*B[i][c];
      }
      row[c] = cell;
    }
    C[r] = row;
  }
  var product = new Matrix(C);
  return product;
};
/** Calculate and return matrix X such that AX = B .
 * A : square matrix
 * B : matrix
 */
Matrix.solveAXisB = function(A, B) {
/*
 * Through sweeping with rows, the AX=B will be transferred into IX=AiB , with Ai = A inverse.
 * A must be square so that it can be swept to I.
 * Dimension considerations:
 * nrA = ncA = n;
 * [n,n]*[nrX,ncX] = [n,ncX] = [nrB,ncB] requires nrX=n, nrB=n, ncX=ncB;
 * and thus the number of unknowns (nrX*ncX) equals the number of equations (nrB*ncB).
 */
  var Am = A.m;
  var Bm = B.m;
  var nrA = Am.length;
  var ncA = Am[0].length;
  var nrB = Bm.length;
  if(nrA !== ncA) throw "A must be square.";
  var nr = nrA;
  var nc = ncA;
  var n = nrA;
  if(n !== nrB) throw "incompatible sizes.";
  var AB = A.concat(B);
  var ABm = AB.m;
  var ncAB = ABm[0].length;
  for(var r = 0; r < nr-1; r++) {  // for r == nr-1 no further swapping or sweeping is required.
    // Invariant: elements ABm[0..r-1][0..r-1] are in upper triangular form.

    // Search for maximum among ABm[r][r] ... ABm[nr-1][r]
    var r2 = r;
    var maxEl = Math.abs(ABm[r2][r]);
    var maxRow = r2;
    ++r2;
    for ( ; r2 < nr; ++r2) {
      if (Math.abs(ABm[r2][r]) > maxEl) {
        maxEl = Math.abs(ABm[r2][r]);
        maxRow = r2;
      }
    }
    // Swap row r with row maxRow
    var tmp = ABm[r];
    ABm[r] = ABm[maxRow];
    ABm[maxRow] = tmp;
    // Make all rows below row r have 0 in column r
    for(var r2 = r + 1; r2 < nr; ++r2) {
      var s = ABm[r2][r] / ABm[r][r];
      var c = r;
      ABm[r2][c] = 0;
      ++c;
      for( ; c < ncAB; ++c) {
        ABm[r2][c] -= s * ABm[r][c];
      }
    }
  }
  // The A in ABm now has upper triangular form.
  
  // Sweep to give the A in ABm identity form:
  for(var r=nr-1; r>=0; --r) {
    // scale row r to have a 1 in column r
    var s = ABm[r][r];
    for(var c=r; c<ncAB; ++c) {
      ABm[r][c] /= s;
    }
    // make all rows above row r have a 0 in column r
    for(var r2=r-1; r2>=0; --r2) {
      var s = ABm[r2][r]/ABm[r][r];
      for(var c=r; c<ncAB; ++c) {
        ABm[r2][c] -= s*ABm[r][c];
      }
    }
  }
  var x = new Matrix(ABm).submatrix(0,n,n,ncAB);
  return x;
};
/** Returns inverse matrix. */
Matrix.prototype.inverse = function() {
  var A = this;
  var B = Matrix.identity(A.m.length);
  var X = Matrix.solveAXisB(A,B);
  return X;
};
/** Calculate and return matrix X such that XA = B .
 * A : square matrix
 * B : matrix
 */
Matrix.solveXAisB = function(A, B) {
  // AT XT = BT
  var AT = A.transpose();
  var BT = B.transpose();
  var XT = Matrix.solveAXisB(AT,BT);
  var X = XT.transpose();
  return X;
}
/** Submatrix with rows [r0,r1-1] and columns [c0,c1-1] . */
Matrix.prototype.submatrix = function(r0,r1,c0,c1) {
  var m = this.m;
  var A = new Array(r1-r0);
  for(var i=0, r=r0; r<r1; ++i, ++r) {
    A[i] = new Array(c1-c0);
    for(var j=0, c=c0; c<c1; ++j, ++c) {
      A[i][j] = m[r][c];
    }
  }
  var result = new Matrix(A);
  return result;
};
Matrix.prototype.toString = function(minCellWidth) {
// minCellWidth = minCellWidth || 5;
//  var s = ArrayFormatter.twoDim(this.m, minCellWidth, "\n", ", ");
  var s = JSON.stringify(this.m);
  return s;
};
/** Returns X such that X maps fromRect to toRect.
 * The points (x0,y0), (x1,y1), (x0,y1) from fromRect map to
 * the points (x0,y0), (x1,y1), (x0,y1) from toRect.
 */
Matrix.fromRectToRect = function(fromRect, toRect) {
  // X A = B
  var fr = fromRect;
  var tr = toRect;
  var A = new Matrix([
    [fr.x0, fr.x1, fr.x0],
    [fr.y0, fr.y1, fr.y1],
    [    1,     1,     1]
  ]);
  var B = new Matrix([
    [tr.x0, tr.x1, tr.x0],
    [tr.y0, tr.y1, tr.y1],
    [    1,     1,     1]
  ]);
  var X = Matrix.solveXAisB(A,B);
  return X;
};
/** Maps object. */
Matrix.prototype.map = function(obj) {
  var result;
  if(obj instanceof Point) {
    result = this.mapPoint(obj);
  }
  else if(obj instanceof Rect) {
    result = this.mapRect(obj);
  }
  else {
    throw "invalid argument";
  }
  return result;
};
Matrix.prototype.mapPoint = function(point) {
  var p = point;
  var p0 = new Matrix([[p.x,p.y,1]]).transpose();
  var p1 = this.multiply(p0);
  var result = new Point(p1.m[0][0], p1.m[1][0]);
  return result;
};
/** Returns rect with (x0,y0) and (x1,y1) mapped by matrix.*/
Matrix.prototype.mapRect = function(rect) {
  var q0 = this.mapPoint(new Point(rect.x0, rect.y0));
  var q1 = this.mapPoint(new Point(rect.x1, rect.y1));
  var result = new Rect(q0.x,q0.y,q1.x,q1.y);
  return result;
};
