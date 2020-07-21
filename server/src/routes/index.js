import { ICONFONT_URL } from '../constants';

var express = require('express');
var router = express.Router();

const clientRoutes = ['/', '/send', '/recv', '/recv/*', '/contact'];

/* GET home page. */
clientRoutes.forEach(r => {
  router.get(r, function(req, res, next) {
    res.render('index', {
      title: '小鹿快传',
      iconfontUrl: ICONFONT_URL,
    });
  });
});

module.exports = router;
