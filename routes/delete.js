const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();


router.post('/words/', async function (req, res, next) {
    const deleteWordIDs = req.body.deleteWordIDs;
    deleteWordIDs.map(async (wordID) => { await deleteWord(Number(wordID)); });
    res.redirect('/dicts/')
});


router.post('/dicts/', async function (req, res, next) {
    const deleteDictID = req.body.dictionaryID;
    await deleteDict(Number(deleteDictID));
    res.redirect('/dicts/')
});
module.exports = router;


async function deleteWord(wordID) {
    await prisma.word.delete({
        where: { id: wordID },
    })
};
async function deleteDict(DictID) {
    await prisma.dictionary.delete({
        where: { id: DictID },
    })
};