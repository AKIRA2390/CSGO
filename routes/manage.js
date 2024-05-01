var express = require('express');
var router = express.Router();

/* GET  page. */
router.get('/selection', function (req, res, next) {
    res.render('21_dictSelection', { title: 'SELECTION' });
});

/* GET  page. */
router.get('/selection/:dictID/manage', function (req, res, next) {
    res.render('22_dictContents', { title: 'MANAGE' });
});

module.exports = router;
