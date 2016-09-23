import express from 'express';
const router = express.Router();

function myFile() {
  console.log('ran myfile');

  return 'tree';
}

var tree = myFile();
console.log(tree);

router.get('/', function(req, res) {
    var tree = myFile();
    console.log(tree);
    res.send('hello world');
});

export default router;
