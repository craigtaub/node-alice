exports.default = function() {
  var tree = 'my tree';

  // console.log('ran route', tree);
  //
  if(tree) {
    result = 'did run';
  } else {
    result = 'did not run';
  }
  //
  console.log(result);

  return tree;
}
