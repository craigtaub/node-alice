import doThisTwo from './es6-test-dep-two';

export default function doThis() {
  const hello = 'hello';

  let tree = doThisTwo();

  if (hello === 'hello') {
    tree = tree + ' again';
  }

  return tree;

  // var router = {get: () => ''};
  // var doThis = () => 'done this now';
  // router.get('/', function(req, res) {
  //     var total = doThis();
  //
  //     res.send('hello world');
  // });
}
