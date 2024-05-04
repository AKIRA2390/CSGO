const { PrismaClient } = require('@prisma/client');
const express = require('express');
const openAI = require('openai')
const prisma = new PrismaClient();

const openai = new openAI();

const router = express.Router();

/* GET  input. */
router.get('/', function (req, res, next) {
    res.render('11_chinese_input');
});

/* GET  analysis. */
router.get('/analysis', function (req, res, next) {
    res.render('12_extracted_words');
});

/* POST  analysis. */
router.post('/analysis', async function (req, res, next) {
    const chinese = req.body.chinese;
    // console.log(`chinese: ${chinese}\n`)

    const completion = await askChatGPTforTranslation(chinese);

    const responceObject = JSON.parse(completion.choices[0].message.content);
    // console.log(responceObject);
    // const responce = JSON.parse(responceObject).message.content;
    // console.log(responce);
    res.render('12_extracted_words', { chinese: chinese, responce: responceObject })
});

/* GET  selection. */
router.get('/analysis/selection', function (req, res, next) {
    res.render('13_dictSelection');
});

/* POST  selection. */
router.post('/analysis/selection', async function (req, res, next) {
    const dictionaries = await prisma.dictionary.findMany();
    res.render('13_dictSelection', {
        chinese: req.body.chinese,
        japanese: req.body.japanese,
        words: req.body.words,
        dictionaries: dictionaries
    });
});

router.post('/analysis/selection/createDictAndAdd', async function (req, res, next) {
    var reqChinese = req.body.chinese,
        reqJapanese = req.body.japanese,
        reqWords = JSON.parse(req.body.words),
        reqDictName = req.body.dictName,
        reqDictDescription = req.body.dictDescription;

    // let reqWords = req.body.words;
    if (Array.isArray(reqWords)) {
        console.log("reqWords is Array!")
        // console.log(reqWords)
        reqWords = (reqWords).map((rowWord) => JSON.parse(rowWord));
    } else {
        console.log("reqWords is NOT Array!")
        // reqWords = JSON.parse(JSON.parse(reqWords));
    }

    console.log("reqWords:");
    console.log(reqWords);

    const newDict = await createDictionary(reqDictName, reqDictDescription);
    const newSentence = await createSentence(reqChinese, reqJapanese, newDict.id);

    if (Array.isArray(reqWords)) {
        for (const word of reqWords) {
            await createWord(word, newDict.id, newSentence.id);
        }
    } else {
        console.log("reqWords is NOT Array!")
        await createWord(reqWords, newDict.id, newSentence.id);
    }

    res.redirect(`/dicts/${newDict.id}/manage`)
});

router.post('/analysis/selection/add2Dict', async function (req, res, next) {
    console.log("add2Dict!");
    var reqChinese = req.body.chinese,
        reqJapanese = req.body.japanese,
        // reqWords = JSON.parse([req.body.words]).map((rowWord) => JSON.parse(rowWord)),
        reqWords = JSON.parse(req.body.words),
        // reqWords = req.body.words,
        reqDictId = Number(req.body.dictID);

    console.log(reqWords);
    console.log(typeof (reqWords));
    console.log(Array.isArray(reqWords));
    // let reqWords;
    // reqWords = reqWords.map((rowWord) => JSON.parse(rowWord));
    //console.log(reqWords);

    if (Array.isArray(reqWords)) {
        console.log("reqWords is array!");
        // reqWords = reqWords.map((rowWord) => JSON.parse(rowWord))
        reqWords = (reqWords).map((rowWord) => JSON.parse(rowWord));
    } else {
        console.log("reqWords is not array!");
        // reqWords = (JSON.parse(reqWords));
    }

    console.log("reqWords:");
    console.log(reqWords);

    const newSentence = await createSentence(reqChinese, reqJapanese, reqDictId);

    if (Array.isArray(reqWords)) {
        for (const word of reqWords) {
            await createWord(word, reqDictId, newSentence.id)
        }
    } else {
        await createWord(reqWords, reqDictId, newSentence.id)
    }

    res.redirect(`/dicts/${reqDictId}/manage`)
});




module.exports = router;

async function askChatGPTforTranslation(chinese) {
    const completion = await openai.chat.completions.create({
        messages: [{
            role:
                "system",
            content:
                `中国語の文章を与えるので、文章全体の日本語訳をした後、文章を単語ごとに分割、全ての単語についてそれぞれ拼音・単語の日本語における意味・品詞・HSKレベルを出力してください。応答はjson形式で、そしてjsonのみでお願いします。\n\
            json例: {"japanese": "私は毎日中国語を勉強しています。","words": [ {"word": "我","pinyin": "wǒ","meaning": "私、私は","partOfSpeech": "代名詞","hskLevel": 1 }, {"word": "每天","pinyin": "měitiān","meaning": "毎日","partOfSpeech": "副詞","hskLevel": 1 }, {"word": "学习","pinyin": "xuéxí","meaning": "学ぶ、勉強する","partOfSpeech": "動詞","hskLevel": 1 }, {"word": "汉语","pinyin": "hànyǔ","meaning": "中国語","partOfSpeech": "名詞","hskLevel": 1 } ]}  \n\
            ${chinese}`
        }],
        model: "gpt-3.5-turbo-0125",
    });
    return completion
}

async function createDictionary(dictName, dictDescription) {

    const newDict = await prisma.dictionary.create({
        data: {
            name: dictName,
            description: dictDescription
        }
    })
    return newDict;
}

async function createSentence(chinese, japanese, dictionaryID) {
    const newSentence = await prisma.sentence.create({
        data: {
            chinese,
            japanese,
            dictionaryID,
        }
    })
    return newSentence
}

// await createWord(reqWords, newDict.id, newSentence.id)
async function createWord(word, dictionaryID, sentenceID) {
    console.log("word:");
    console.log(word);
    console.log(word.word);
    // word = JSON.parse(word)
    const newWord = await prisma.word.create({
        data: {
            word: word.word,
            pinyin: word.pinyin,
            meaning: word.meaning,
            partOfSpeech: word.partOfSpeech,
            hskLevel: word.hskLevel,

            dictionaryID,
            sentenceID
        }
    })
    return newWord;
}

// async function addWordsID2Sents()
