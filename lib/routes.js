'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

function ranRoute() {
    var tree = 'my tree';

    console.log('ran route', tree);
}

router.get('/', function (req, res) {
  ranRoute();
  res.send('hello world');
});

exports.default = router;
