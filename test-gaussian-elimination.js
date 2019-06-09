
// requires matrix.js
// requires gaussian-elimination.js

var A = new Matrix(
        [
         [ 1, 2, 3, 4],
         [ 2, 2, 2, 3],
         [ 0,-2, 1, 2],
         [ 3, 2, 3, 4]
]);

var xIn = [ 2, 3, 4, 5];

var b = A.multiply(xIn);

var xOut = A.solve(b);

console.log("xIn: " + xIn);
console.log("b: " + b);
console.log("xOut: " + xOut);

