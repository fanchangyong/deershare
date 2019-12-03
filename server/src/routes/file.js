import { getCode } from '../controllers/file';

var express = require('express');
var router = express.Router();

router.post('/api/file/code', getCode);

module.exports = router;
