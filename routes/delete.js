const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();


router.post('/words/', async function (req, res, next) {
    // const WordIDs = Array.from(req.body.deleteWordsIDs).map((wordID) => parseInt(wordID));
    const WordIDs = ((req.body.deleteWordsIDs).parseInt);
    // WordIDs.map(async (wordID) => { await deleteWord(parseInt(wordID)); });
    console.log(req.body.deleteWordsIDs)
    console.log(WordIDs)
    await prisma.word.deleteMany({
        where: { id: { in: WordIDs } },
    });

    res.redirect(`/dicts/${req.body.dictionaryID}/manage`)
});

router.post('/sentences', async function (req, res, next) {
    const sentenceIDs = Array.from(req.body.deleteSentsIDs).map((id) => parseInt(id));

    await prisma.sentence.deleteMany({
        where: { id: { in: sentenceIDs } },
    });

    res.redirect(`/dicts/${req.body.dictionaryID}/manage`);
})

router.post('/dicts/', async function (req, res, next) {
    const deleteDictID = Number(req.body.dictionaryID);
    await deleteDict(deleteDictID);
    res.redirect('/dicts/')
});

module.exports = router;


async function deleteWord(wordID) {
    await prisma.word.delete({
        where: { id: Number(wordID) },
    })
};
async function deleteDict(DictID) {
    await prisma.dictionary.delete({
        where: { id: DictID },
    })
};