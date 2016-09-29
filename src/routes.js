import express from 'express';
import calculation from './calculation';

const router = express.Router();

// function myFile() {
//   console.log('ran myfile');
//
//   return 'tree';
// }

// var tree = myFile();
// console.log(tree);

// WORKS BUT BAD
router.use(function(req, resp, next) {
    singleton.clearAll();
    next();
});

router.get('/', function(req, res) {
    var total = calculation();
    // console.log(total);
    res.send('hello world');
});

export default router;
