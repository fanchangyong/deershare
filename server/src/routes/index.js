import { hello } from '../controllers/hello';

var express = require('express');
var router = express.Router();

const clientRoutes = ['/', '/send', '/recv', '/r/*'];

/* GET home page. */
clientRoutes.forEach(r => {
  router.get(r, function(req, res, next) {
    res.render('index', { title: '小鹿快传' });
  });
});
// router.get('/', function(req, res, next) {
//   res.render('index', { title: '小鹿快传' });
// });

router.post('/api/hello', hello);

module.exports = router;
