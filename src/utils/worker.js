/* eslint-disable-line no-restricted-globals */
function test(array, i, j) {
    var self = this;
    self.postMessage(['test', i, j]);
    return array[i] - array[j];
}

/* eslint-disable-line no-restricted-globals */
function swap(array, i, j) {
  var self = this;
  self.postMessage(['swap', i, j]);
  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}