import { addFeedback } from '../controllers/feedback';

var express = require('express');
var router = express.Router();

router.post('/', addFeedback);

module.exports = router;
