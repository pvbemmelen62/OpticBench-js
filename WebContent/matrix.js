
// Square matrix
Matrix = function(m) {
    this.m = m;
    var numCols = m[0].length;
    for(var r=1; r<m.length; ++r) {
        var okay = m[r].length == numCols;
        if(!okay) {
            throw "Invalid input: matrix has rows of varying length.";
        }
    }
};
Matrix.copy = function(m) {
  var A = new Array(m.length);
  for(var r=0; r<m.length; ++r) {
      A[r] = new Array(m[r].length);
      for(var c=0; c<m[r].length; ++c) {
          A[r][c] = m[r][c];
      }
  }
  return A;
}
Matrix.concat = function(A,B) {
  if(A.length != B.length) throw "Incompatible dimensions";
  var nr = A.length;
  ga hier verder
}

Matrix.prototype = {
        // multiply matrix with vector x
        multiply : function(x) {
            var m = this.m;
            var result = new Array(m.length);
            for(var r=0; r<m.length; ++r) {
                result[r] = 0;
                for(var c=0; c<m[0].length; ++c) {
                    result[r] += m[r][c]*x[c];
                }
            }
            return result;
        },
        copy : function() {
            var m = this.m;
            var result = new Array(m.length);
            for(var r=0; r<m.length; ++r) {
                result[r] = new Array(m[r].length);
                for(var c=0; c<m[r].length; ++c) {
                    result[r][c] = m[r][c];
                }
            }
            return result;
        },
        // Return x such that:  Matrix * x = b
        solve : function(b) {
            if(! this.m.length == b.length) {
                throw "Invalid argument: b has wrong length";
            }
            var Ab = this.copy();
            for(var r=0; r<Ab.length; ++r) {
                Ab[r].push(b[r]);
            }
            var x = gauss(Ab, this.debug);
            return x;
        },
        toString: function(maxWidth) {
          var m = this.m;
          var nr = m.length;
          var nc = m[0].length;
          var txt = "{\n";
          for(var r=0; r<nr; ++r) {
            txt += "  {";
            for(var c=0; c<nc; ++c) {
              var s = String(m[r][c]);
              s = s.substring(0,maxWidth);
              txt += s;
              if(c<nc-1) {
                txt += ", ";
              }
            }
            txt += "  },\n";
          }
          txt += "}\n";
          return txt;
        },
        debug: function(m) {
          alert(this.toString(m));
          //alert("mama");
        }
};