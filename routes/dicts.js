const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();


router.get('/', async function (req, res, next) {
    const dictionaries = await prisma.dictionary.findMany();
    res.render('21_dictSelection', { dictionaries });
});

router.get('/:dictID/manage', async function (req, res, next) {
    const dictionaryID = Number(req.params.dictID)
    const dictWords = await prisma.word.findMany({
        where: { dictionaryID }
    });
    res.render('22_dictContents', { dictWords, dictionaryID });
});


module.exports = router;

