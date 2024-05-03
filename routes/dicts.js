const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();


/* GET  page. */
router.get('/', async function (req, res, next) {
    const dictionaries = await prisma.dictionary.findMany();
    console.log(dictionaries.length);
    res.render('21_dictSelection', { dictionaries });
});

/* GET  page. */
router.get('/:dictID/manage', async function (req, res, next) {
    const allWords = await prisma.word.findMany();
    res.render('22_dictContents', {allWords});
});

module.exports = router;
