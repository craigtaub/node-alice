import express from 'express';
const router = express.Router();
import calculation from './calculation';

function myFile() {
  console.log('ran myfile');

  return 'tree';
}

var tree = myFile();
console.log(tree);

router.get('/', function(req, res) {
    var total = calculation();
    console.log(total);
    res.send('hello world');
});

export default router;
