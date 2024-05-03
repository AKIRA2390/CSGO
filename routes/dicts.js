const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();


router.get('/', async function (req, res, next) {
    const dictionaries = await prisma.dictionary.findMany();
    // console.log(dictionaries);
    res.render('21_dictSelection', { dictionaries });
});

router.get('/:dictID/manage', async function (req, res, next) {
    const dictionaryID = Number(req.params.dictID);
    const dictionaryName = (await prisma.dictionary.findFirst({
        where: { id: dictionaryID }
    })).name;
    const dictWords = await prisma.word.findMany({
        where: { dictionaryID }
    });

    const dictSents = await prisma.sentence.findMany({
        include: { words: true, },
        where: { dictionaryID }
    });
    console.log(dictionaryName);
    // console.log(dictSents.map((sents) => console.log(sents.words));
    res.render('22_dictContents', { dictWords, dictSents, dictionaryID, dictionaryName });
});


module.exports = router;

